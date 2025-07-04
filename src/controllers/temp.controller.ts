import tempService from '~services/temp.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class TempController {
	async getShippingDate(req: FastifyRequest, res: FastifyResponse) {
		return tempService.getShippingDateHandle(req, res);
	}

	async getCookingLevel(req: FastifyRequest, res: FastifyResponse) {
		return tempService.getCookingLevelHandle(req, res);
	}
}

export default new TempController();
