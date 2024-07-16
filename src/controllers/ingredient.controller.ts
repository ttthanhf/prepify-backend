import ingredientService from '~services/ingredient.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class IngredientController {
	async getIngredient(req: FastifyRequest, res: FastifyResponse) {
		return ingredientService.getIngredientHandle(req, res);
	}
}

export default new IngredientController();
