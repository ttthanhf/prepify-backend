import { Fastify } from '~types/fastify.type';
import recipeModeratorController from '~controllers/moderator/recipe.controller';
import authMiddleware from '~middlewares/auth.middleware';
import { Role } from '~constants/role.constant';
import { recipeModeratorQueryGetRequestSchema } from '~models/schemas/moderator/recipe.schemas.model';

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
				consumes: ['multipart/form-data']
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		recipeModeratorController.updateRecipe
	);
}
