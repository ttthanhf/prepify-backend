import { FastifyRequest } from 'fastify';
import ingredientService from '~services/moderator/ingredient.service';
import { FastifyResponse } from '~types/fastify.type';

class IngredientModeratorController {
	async getAllIngredient(req: FastifyRequest, res: FastifyResponse) {
		return ingredientService.getAllIngredientHandle(req, res);
	}
}

export default new IngredientModeratorController();
