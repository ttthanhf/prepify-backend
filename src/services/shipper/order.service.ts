import { BatchStatus } from '~constants/batchstatus.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { ImageType } from '~constants/image.constant';
import { OrderStatus } from '~constants/orderstatus.constant';
import { RABBITMQ_CONSTANT } from '~constants/rabbitmq.constant';
import ResponseModel from '~models/responses/response.model';
import {
	OrderShipperGetRequest,
	OrderShipperUpdateRequest
} from '~models/schemas/shipper/order.schemas.model';
import batchRepository from '~repositories/batch.repository';
import imageRepository from '~repositories/image.repository';
import orderRepository from '~repositories/order.repository';
import orderBatchRepository from '~repositories/orderBatch.repository';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import { calDurationUntilTargetTime } from '~utils/date.util';
import RabbitMQUtil from '~utils/rabbitmq.util';
import userUtil from '~utils/user.util';

class OrderService {
	async getOrdersInCurrentBatchHandle(
		req: FastifyRequest,
		res: FastifyResponse
	) {
		const response = new ResponseModel(res);
		const shipper = await userUtil.getUserByTokenInHeader(req.headers);
		const query: OrderShipperGetRequest = req.query as OrderShipperGetRequest;

		const currentBatch = await batchRepository.findOne({
			where: {
				user: {
					id: shipper!.id
				},
				status: BatchStatus.PICKED_UP
			},
			order: {
				datetime: 'DESC'
			},
			relations: ['user']
		});

		if (!currentBatch) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			response.message = 'No batch found';
			return response.send();
		}

		const queryBuilder = orderBatchRepository
			.getRepository()
			.createQueryBuilder('orderBatch')
			.leftJoinAndSelect('orderBatch.order', 'order')
			.leftJoinAndSelect('orderBatch.batch', 'batch')
			.leftJoinAndSelect('order.customer', 'customer')
			.leftJoinAndSelect('order.area', 'area')
			.leftJoinAndSelect('customer.user', 'user')
			.where('batch.id = :batchId', { batchId: currentBatch.id });

		let statusList: string[] = [];
		if (query.status && query.status.split(',').length > 0) {
			statusList = query.status.split(',');
			console.log('🚀 ~ OrderService ~ statusList:', statusList);
			queryBuilder.andWhere('orderBatch.status IN (:...statusList)', {
				statusList
			});
		}

		const orderBatches = await queryBuilder.getMany();

		response.data = {
			orders: await Promise.all(
				orderBatches.map(async (orderBatch) => {
					if (orderBatch.status !== OrderStatus.DELIVERED) {
						return orderBatch.order;
					}
					const images = await imageRepository.findBy({
						type: ImageType.REPORT,
						entityId: orderBatch.order.id
					});
					return {
						...orderBatch.order,
						images
					};
				})
			)
		};
		return response.send();
	}

	async updateOrderHandle(req: FastifyRequest, res: FastifyResponse) {
		const { id } = req.params as { id: string };
		const shipper = await userUtil.getUserByTokenInHeader(req.headers);
		const response = new ResponseModel(res);

		const orderUpdateRequest: OrderShipperUpdateRequest =
			req.body as OrderShipperUpdateRequest;

		const currentBatch = await batchRepository.findOne({
			where: {
				user: {
					id: shipper!.id
				},
				status: BatchStatus.PICKED_UP
			},
			order: {
				datetime: 'DESC'
			},
			relations: ['user']
		});

		if (!currentBatch) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			response.message = 'No batch found';
			return response.send();
		}

		const orderBatch = await orderBatchRepository
			.getRepository()
			.createQueryBuilder('orderBatch')
			.leftJoinAndSelect('orderBatch.order', 'order')
			.leftJoinAndSelect('orderBatch.batch', 'batch')
			.where('order.id = :orderId', { orderId: id })
			.andWhere('batch.id = :batchId', { batchId: currentBatch.id })
			.getOne();

		if (!orderBatch) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			response.message = 'Order not found';
			return response.send();
		}

		orderBatch.status = orderUpdateRequest.status;
		if (orderUpdateRequest.note) {
			orderBatch.note = orderUpdateRequest.note;
		}

		await orderBatchRepository.update(orderBatch);

		const order = await orderRepository.findOneBy({
			id
		});

		// if status is delivered or cannceled, update status order
		if (
			orderUpdateRequest.status === OrderStatus.DELIVERED ||
			orderUpdateRequest.status === OrderStatus.CANCELED
		) {
			order!.status = orderUpdateRequest.status;
		}

		// if status is delivering, update deliveryCount
		if (orderUpdateRequest.status === OrderStatus.DELIVERING) {
			order!.status = OrderStatus.DELIVERING;
			order!.deliveryCount += 1;
		}

		// if status is delayed, order will be pushed to delayed queue if deliveryCount <= 1
		if (orderUpdateRequest.status === OrderStatus.DELAYED) {
			if (order?.deliveryCount === 2) {
				order.status = OrderStatus.CANCELED;
			} else if (order?.deliveryCount === 1) {
				order.status = OrderStatus.DELAYED;

				// push to delayed queue
				const rabbitmqInstance = await RabbitMQUtil.getInstance();

				const timeRemainingUntil7am = calDurationUntilTargetTime(
					new Date(),
					7,
					0,
					0
				);

				rabbitmqInstance.publishMessageToDelayQueue(
					RABBITMQ_CONSTANT.EXCHANGE.ORDER_PROCESS,
					RABBITMQ_CONSTANT.ROUTING_KEY.ORDER_PROCESS,
					JSON.stringify(order),
					timeRemainingUntil7am.asMilliseconds()
				);
			}
		}
		await orderRepository.update(order!);

		return response.send();
	}

	async getNumberOfOrdersByStatusHandle(
		req: FastifyRequest,
		res: FastifyResponse
	) {
		const response = new ResponseModel(res);

		let orderQuery = await orderRepository
			.getRepository()
			.createQueryBuilder('order')
			.select('order.status, COUNT(order.id) as orderCount')
			.groupBy('order.status');

		const orderCounts = await orderQuery.getRawMany();

		response.data = {
			orderCounts
		};

		return response.send();
	}
}

export default new OrderService();
