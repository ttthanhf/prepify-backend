import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { OrderStatus } from '~constants/orderstatus.constant';
import ResponseModel from '~models/responses/response.model';
import {
	OrderShipperGetRequest,
	OrderShipperUpdateRequest
} from '~models/schemas/shipper/order.schemas.model';
import batchRepository from '~repositories/batch.repository';
import orderRepository from '~repositories/order.repository';
import orderBatchRepository from '~repositories/orderBatch.repository';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
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

		const queryBuilder = orderBatchRepository
			.getRepository()
			.createQueryBuilder('orderBatch')
			.leftJoinAndSelect('orderBatch.order', 'order')
			.leftJoinAndSelect('orderBatch.batch', 'batch')
			.where('batch.id = :batchId', { batchId: currentBatch.id });

		if (query.status && query.status.split(',').length > 0) {
			const statusList = query.status.split(',');
			queryBuilder.andWhere('orderBatch.status IN (:...statusList)', {
				statusList
			});
		}

		const orderBatches = await queryBuilder.getMany();

		response.data = {
			orders: orderBatches.map((orderBatch) => {
				return orderBatch.order;
			})
		};
		return response.send();
	}

	async updateOrderHandle(req: FastifyRequest, res: FastifyResponse) {
		const { id } = req.params as { id: string };
		const response = new ResponseModel(res);

		const orderUpdateRequest: OrderShipperUpdateRequest =
			req.body as OrderShipperUpdateRequest;

		const orderBatch = await orderBatchRepository.findOne({
			where: {
				order: {
					id
				},
				batch: {
					id: orderUpdateRequest.batchId
				}
			}
		});

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

		if (
			orderUpdateRequest.status === OrderStatus.DELIVERED ||
			orderUpdateRequest.status === OrderStatus.CANCELED
		) {
			const order = await orderRepository.findOneBy({
				id
			});
			order!.status = orderUpdateRequest.status;
			await orderRepository.update(order!);
		}

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
