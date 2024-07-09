import { Fastify } from '~types/fastify.type';
import recipeModeratorController from '~controllers/moderator/recipe.controller';
import authMiddleware from '~middlewares/auth.middleware';
import { Role } from '~constants/role.constant';
import {
	ingredientRecipeUpdateRequestSchema,
	mealkitsRecipeUpdateRequestSchema,
	nutritionRecipeUpdateRequestSchema,
	recipeModeratorQueryGetRequestSchema,
	recipeUpdateRequestSchema
} from '~models/schemas/moderator/recipe.schemas.model';

export default async function recipeRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/recipes',
		{
			schema: {
				querystring: recipeModeratorQueryGetRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		recipeModeratorController.getAllRecipe
	);
	app.get(
		'/recipes/:recipe_id',
		{
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		recipeModeratorController.getRecipe
	);
	app.post(
		'/recipes',
		{
			schema: {
				consumes: ['multipart/form-data']
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		recipeModeratorController.createRecipe
	);
	app.put(
		'/recipes/:recipe_id',
		{
			schema: {
				body: recipeUpdateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		recipeModeratorController.updateRecipe
	);
	app.delete(
		'/recipes/:recipe_id',
		{
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		recipeModeratorController.deleteRecipe
	);

	app.put(
		'/recipes/:recipe_id/ingredients',
		{
			schema: {
				body: ingredientRecipeUpdateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		recipeModeratorController.updateRecipeIngredient
	);
	app.put(
		'/recipes/:recipe_id/nutritions',
		{
			schema: {
				body: nutritionRecipeUpdateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		recipeModeratorController.updateRecipeNutrition
	);
	app.put(
		'/recipes/:recipe_id/mealKits',
		{
			schema: {
				body: mealkitsRecipeUpdateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		recipeModeratorController.updateRecipeMealKit
	);
}
