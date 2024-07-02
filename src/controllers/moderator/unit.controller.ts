import { FastifyRequest } from 'fastify';
import { FastifyResponse } from '~types/fastify.type';
import unitModeratorService from '~services/moderator/unit.service';

class CategoryModeratorController {
	async getUnit(req: FastifyRequest, res: FastifyResponse) {
		return unitModeratorService.getUnitHandle(req, res);
	}

	async createUnit(req: FastifyRequest, res: FastifyResponse) {
		return unitModeratorService.createUnitHandle(req, res);
	}
}

export default new CategoryModeratorController();
