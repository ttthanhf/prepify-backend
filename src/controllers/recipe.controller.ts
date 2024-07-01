import recipeService from '~services/recipe.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class RecipeController {
	async getRecipe(req: FastifyRequest, res: FastifyResponse) {
		return recipeService.getRecipeHandle(req, res);
	}
}

export default new RecipeController();
