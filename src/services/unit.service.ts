import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

import unitRepository from '~repositories/unit.repository';
import ResponseModel from '~models/responses/response.model';

class UnitService {
	async getUnitHandle(req: FastifyRequest, res: FastifyResponse) {
		const response = new ResponseModel(res);
		response.data = await unitRepository.findAll();
		return response.send();
	}
}

export default new UnitService();
