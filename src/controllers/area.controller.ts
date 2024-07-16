import areaService from '~services/area.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class AreaController {
	async getAllArea(req: FastifyRequest, res: FastifyResponse) {
		return areaService.getAllAreaHandle(req, res);
	}
}

export default new AreaController();
