import nutritionService from '~services/nutrition.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class UnitController {
	async getNutrition(req: FastifyRequest, res: FastifyResponse) {
		return nutritionService.getNutritionHandle(req, res);
	}
}

export default new UnitController();
