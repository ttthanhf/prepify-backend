import orderService from '~services/order.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class OrderController {
	async orderHandle(req: FastifyRequest, res: FastifyResponse) {
		return orderService.orderHandle(req, res);
	}

	async getAllOrder(req: FastifyRequest, res: FastifyResponse) {
		return orderService.getAllOrderHandle(req, res);
	}

	async getOrder(req: FastifyRequest, res: FastifyResponse) {
		return orderService.getOrderHandle(req, res);
	}
}

export default new OrderController();
