import mealKitService from '~services/moderator/mealKit.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class MealKitModeratorController {
	async getAllMealkit(req: FastifyRequest, res: FastifyResponse) {
		return mealKitService.getAllMealKitHandle(req, res);
	}

	async getMealkit(req: FastifyRequest, res: FastifyResponse) {
		return mealKitService.getMealKitHandle(req, res);
	}

	async createMealkit(req: FastifyRequest, res: FastifyResponse) {
		return mealKitService.createMealKitHandle(req, res);
	}

	async updateMealKit(req: FastifyRequest, res: FastifyResponse) {
		return mealKitService.updateMealKitHandle(req, res);
	}

	async toggleStatus(req: FastifyRequest, res: FastifyResponse) {
		return mealKitService.toggleStatusHandle(req, res);
	}
}

export default new MealKitModeratorController();
