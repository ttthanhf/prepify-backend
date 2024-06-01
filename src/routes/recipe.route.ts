import authMiddleware from '~middlewares/auth.middleware';

import { Fastify } from '~types/fastify.type';
import { Role } from '~constants/role.constant';
import recipeController from '~controllers/recipe.controller';

export default async function recipeRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.post(
		'/recipes',
		{
			schema: {
				consumes: ['multipart/form-data']
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR, Role.ADMIN]
			}
		},
		recipeController.createRecipe
	);
}
