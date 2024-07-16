import recipeModeratorService from '~services/moderator/recipe.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class RecipeModeratorController {
	async getAllRecipe(req: FastifyRequest, res: FastifyResponse) {
		return recipeModeratorService.getAllRecipeHandle(req, res);
	}
	async getRecipe(req: FastifyRequest, res: FastifyResponse) {
		return recipeModeratorService.getRecipeHandle(req, res);
	}
	async createRecipe(req: FastifyRequest, res: FastifyResponse) {
		return recipeModeratorService.createRecipeHandle(req, res);
	}
	async deleteRecipe(req: FastifyRequest, res: FastifyResponse) {
		return recipeModeratorService.deleteRecipeHandle(req, res);
	}

	async updateRecipe(req: FastifyRequest, res: FastifyResponse) {
		return recipeModeratorService.updateRecipeHandle(req, res);
	}
	async updateRecipeIngredient(req: FastifyRequest, res: FastifyResponse) {
		return recipeModeratorService.updateRecipeIngredientHandle(req, res);
	}
	async updateRecipeNutrition(req: FastifyRequest, res: FastifyResponse) {
		return recipeModeratorService.updateRecipeNutritionHandle(req, res);
	}
	async updateRecipeMealKit(req: FastifyRequest, res: FastifyResponse) {
		return recipeModeratorService.updateRecipeMealkitHandle(req, res);
	}
}

export default new RecipeModeratorController();
