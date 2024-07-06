import recipeService from '~services/recipe.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class RecipeController {
	async getAllRecipe(req: FastifyRequest, res: FastifyResponse) {
		return recipeService.getAllRecipeHandle(req, res);
	}

	async getRecipe(req: FastifyRequest, res: FastifyResponse) {
		return recipeService.getRecipeHandle(req, res);
	}
}

export default new RecipeController();
