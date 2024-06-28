import tempService from '~services/temp.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class TempController {
	async getArea(req: FastifyRequest, res: FastifyResponse) {
		return tempService.getAreaHandle(req, res);
	}

	async getShippingDate(req: FastifyRequest, res: FastifyResponse) {
		return tempService.getShippingDateHandle(req, res);
	}

	async getCookingLevel(req: FastifyRequest, res: FastifyResponse) {
		return tempService.getCookingLevelHandle(req, res);
	}

	async getOrderStatus(req: FastifyRequest, res: FastifyResponse) {
		return tempService.getOrderStatusHandle(req, res);
	}

	async getPayment(req: FastifyRequest, res: FastifyResponse) {
		return tempService.getPaymentHandle(req, res);
	}
}

export default new TempController();
