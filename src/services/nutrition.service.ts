import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

import ResponseModel from '~models/responses/response.model';
import nutritionRepository from '~repositories/nutrition.repository';

class NutritionService {
	async getNutritionHandle(req: FastifyRequest, res: FastifyResponse) {
		const response = new ResponseModel(res);
		response.data = await nutritionRepository.findAll();
		return response.send();
	}
}

export default new NutritionService();
