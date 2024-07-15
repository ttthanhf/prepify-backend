import { In, Not } from 'typeorm';
import { BatchStatus } from '~constants/batchstatus.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { ImageType } from '~constants/image.constant';
import { OrderStatus } from '~constants/orderstatus.constant';
import { RABBITMQ_CONSTANT } from '~constants/rabbitmq.constant';
import { getWorkStartTime } from '~constants/timeframe.constant';
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
				status: Not(BatchStatus.CREATED)
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
		console.log('🚀 ~ OrderService ~  orderBatches :', orderBatches);

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
				}
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

		// if status is delivered or canceled, update status order
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
				const workStartTime = await getWorkStartTime();

				const timeRemainingUntilWorkStart = calDurationUntilTargetTime(
					new Date(),
					workStartTime
				);

				rabbitmqInstance.publishMessageToDelayQueue(
					RABBITMQ_CONSTANT.EXCHANGE.ORDER_PROCESS,
					RABBITMQ_CONSTANT.ROUTING_KEY.ORDER_PROCESS,
					JSON.stringify(order),
					timeRemainingUntilWorkStart.asMilliseconds()
				);
			}
		}
		await orderRepository.update(order!);

		// if no order in batch, update batch status to delivered
		const orderBatches = await orderBatchRepository.find({
			where: {
				batch: {
					id: currentBatch.id
				},
				status: In([OrderStatus.PICKED_UP, OrderStatus.DELIVERING])
			},
			relations: ['batch']
		});
		console.log(
			'🚀 ~ OrderService ~ updateOrderHandle ~ orderBatches:',
			orderBatches
		);

		if (orderBatches.length === 0) {
			currentBatch.status = BatchStatus.DELIVERED;
			await batchRepository.update(currentBatch);
		}

		response.message = "Order's status updated";
		return response.send();
	}

	async getNumberOfOrdersByStatusHandle(
		req: FastifyRequest,
		res: FastifyResponse
	) {
		const response = new ResponseModel(res);

		let batchQuery = batchRepository
			.getRepository()
			.createQueryBuilder('batch')
			.select('batch.id')
			.where('batch.status IN (:...batchStatus)', {
				batchStatus: [BatchStatus.PICKED_UP, BatchStatus.DELIVERED]
			})
			.orderBy('batch.datetime', 'DESC')
			.limit(1);

		const batch = await batchQuery.getOne();

		if (!batch) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			response.message = 'No batch found';
			return response.send();
		}

		let orderBatchQuery = orderBatchRepository
			.getRepository()
			.createQueryBuilder('orderBatch')
			.select('orderBatch.status, COUNT(*) as orderCount')
			.where('orderBatch.batch = :batchId', { batchId: batch.id })
			.groupBy('orderBatch.status');

		const orderCounts = await orderBatchQuery.getRawMany();

		response.data = {
			orderCounts
		};

		return response.send();
	}
}

export default new OrderService();
