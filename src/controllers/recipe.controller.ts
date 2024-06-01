import recipeService from '~services/recipe.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class RecipeController {
	async createRecipe(req: FastifyRequest, res: FastifyResponse) {
		return recipeService.createRecipeHandle(req, res);
	}
}

export default new RecipeController();
