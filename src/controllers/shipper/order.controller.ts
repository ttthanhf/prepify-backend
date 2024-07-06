import orderService from '~services/shipper/order.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class OrderController {
	async getOrders(req: FastifyRequest, res: FastifyResponse) {
		return orderService.getOrdersHandle(req, res);
	}

	async updateOrder(req: FastifyRequest, res: FastifyResponse) {
		return orderService.updateOrderHandle(req, res);
	}

	async getNumberOfOrdersByStatus(req: FastifyRequest, res: FastifyResponse) {
		return orderService.getNumberOfOrdersByStatusHandle(req, res);
	}
}

export default new OrderController();
