import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import orderModeratorService from '~services/moderator/order.service';

class OrderModeratorController {
	async getOrders(req: FastifyRequest, res: FastifyResponse) {
		return orderModeratorService.getOrdersHandle(req, res);
	}

	async getOrderById(req: FastifyRequest, res: FastifyResponse) {
		return orderModeratorService.getOrderByIdHandle(req, res);
	}
}

export default new OrderModeratorController();
