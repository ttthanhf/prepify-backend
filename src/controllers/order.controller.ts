import orderService from '~services/order.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class OrderController {
	async orderHandle(req: FastifyRequest, res: FastifyResponse) {
		return orderService.orderHandle(req, res);
	}
}

export default new OrderController();
