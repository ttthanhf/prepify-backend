import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { OrderStatus } from '~constants/orderstatus.constant';
import ResponseModel from '~models/responses/response.model';
import {
	OrderShipperGetRequest,
	OrderShipperUpdateRequest
} from '~models/schemas/shipper/order.schemas.model';
import orderRepository from '~repositories/order.repository';
import orderBatchRepository from '~repositories/orderBatch.repository';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import userUtil from '~utils/user.util';

class OrderService {
	async getOrdersHandle(req: FastifyRequest, res: FastifyResponse) {
		const response = new ResponseModel(res);
		const shipper = await userUtil.getUserByTokenInHeader(req.headers);
		const query: OrderShipperGetRequest = req.query as OrderShipperGetRequest;

		let orderQuery = await orderRepository
			.getRepository()
			.createQueryBuilder('order')
			.leftJoinAndSelect('order.customer', 'customer')
			.leftJoinAndSelect('customer.user', 'user')
			.leftJoinAndSelect('order.area', 'area');

		if (query.status) {
			const statuses = query.status.split(',');
			orderQuery = orderQuery.andWhere('order.status IN (:...statuses)', {
				statuses
			});
		}

		const orders = await orderQuery.getMany();

		response.data = {
			orders
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
