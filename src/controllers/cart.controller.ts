import cartService from '~services/cart.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class CartController {
	async getCart(req: FastifyRequest, res: FastifyResponse) {
		return cartService.getCartHandle(req, res);
	}

	async createCart(req: FastifyRequest, res: FastifyResponse) {
		return cartService.createCartHandle(req, res);
	}

	async updateCart(req: FastifyRequest, res: FastifyResponse) {
		return cartService.updateCartHandle(req, res);
	}
}

export default new CartController();
