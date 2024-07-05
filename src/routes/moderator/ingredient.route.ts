import authMiddleware from '~middlewares/auth.middleware';
import { Role } from '~constants/role.constant';
import { Fastify } from '~types/fastify.type';
import {
	ingredientModeratorCreateRequestSchema,
	ingredientModeratorQueryGetRequestSchema,
	ingredientModeratorUpdateRequestSchema
} from '~models/schemas/moderator/ingredient.schemas.model';
import ingredientController from '~controllers/moderator/ingredient.controller';

export default async function categoryRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/ingredients',
		{
			schema: {
				queryString: ingredientModeratorQueryGetRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		ingredientController.getAllIngredient
	);
	app.get(
		'/ingredients/:id',
		{
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		ingredientController.getIngredient
	);
	app.post(
		'/ingredients',
		{
			schema: {
				body: ingredientModeratorCreateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		ingredientController.createIngredient
	);
	app.put(
		'/ingredients/:id',
		{
			schema: {
				body: ingredientModeratorUpdateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		ingredientController.updateIngredient
	);
}
