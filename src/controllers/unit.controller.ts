import unitService from '~services/unit.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class UnitController {
	async getUnit(req: FastifyRequest, res: FastifyResponse) {
		return unitService.getUnitHandle(req, res);
	}
}

export default new UnitController();
