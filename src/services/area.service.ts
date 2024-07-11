import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import areaRepository from '~repositories/area.repository';

class AreaService {
	async getAllAreaHandle(req: FastifyRequest, res: FastifyResponse) {
		const area = await areaRepository.findAll();
		const response = new ResponseModel(res);
		response.data = area;
		return response.send();
	}
}

export default new AreaService();
