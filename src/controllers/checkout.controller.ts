import checkoutService from '~services/checkout.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class CheckoutController {
	async getCheckout(req: FastifyRequest, res: FastifyResponse) {
		return checkoutService.getCheckoutHandle(req, res);
	}

	async createCheckout(req: FastifyRequest, res: FastifyResponse) {
		return checkoutService.createCheckoutHandle(req, res);
	}
}

export default new CheckoutController();
