import { FastifyRequest } from 'fastify';
import ingredientService from '~services/moderator/ingredient.service';
import { FastifyResponse } from '~types/fastify.type';

class IngredientModeratorController {
	async getAllIngredient(req: FastifyRequest, res: FastifyResponse) {
		return ingredientService.getAllIngredientHandle(req, res);
	}
	async createIngredient(req: FastifyRequest, res: FastifyResponse) {
		return ingredientService.createIngredientHandle(req, res);
	}

	async updateIngredient(req: FastifyRequest, res: FastifyResponse) {
		return ingredientService.updateIngredientHandle(req, res);
	}

	async getIngredient(req: FastifyRequest, res: FastifyResponse) {
		return ingredientService.getIngredientHandle(req, res);
	}
}

export default new IngredientModeratorController();
