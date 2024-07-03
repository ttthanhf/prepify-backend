import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import foodStyleService from '~services/moderator/foodStyle.service';

class FoodStyleModeratorController {
	async getFoodStyle(req: FastifyRequest, res: FastifyResponse) {
		return foodStyleService.getAllFoodStyleHandle(req, res);
	}

	async createFoodStyle(req: FastifyRequest, res: FastifyResponse) {
		return foodStyleService.createFoodStyleHandle(req, res);
	}

	async updateFoodStyle(req: FastifyRequest, res: FastifyResponse) {
		return foodStyleService.updateFoodStyleHandle(req, res);
	}

	async deleteFoodStyle(req: FastifyRequest, res: FastifyResponse) {
		return foodStyleService.deleteFoodStyleHandle(req, res);
	}
}

export default new FoodStyleModeratorController();
