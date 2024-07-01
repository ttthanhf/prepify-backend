import recipeModeratorService from '~services/moderator/recipe.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class RecipeModeratorController {
	async getRecipe(req: FastifyRequest, res: FastifyResponse) {
		return recipeModeratorService.getRecipeHandle(req, res);
	}
	async createRecipe(req: FastifyRequest, res: FastifyResponse) {
		return recipeModeratorService.createRecipeHandle(req, res);
	}
	async updateRecipe(req: FastifyRequest, res: FastifyResponse) {
		return recipeModeratorService.updateRecipeHandle(req, res);
	}
}

export default new RecipeModeratorController();
