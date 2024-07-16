import authMiddleware from '~middlewares/auth.middleware';
import { Role } from '~constants/role.constant';
import { Fastify } from '~types/fastify.type';
import {
	ingredientModeratorCreateRequestSchema,
	ingredientModeratorQueryGetRequestSchema,
	ingredientModeratorUpdateRequestSchema
} from '~models/schemas/moderator/ingredient.schemas.model';
import ingredientController from '~controllers/moderator/ingredient.controller';
import { SwaggerTag } from '~constants/swaggertag.constant';

export default async function categoryRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/ingredients',
		{
			schema: {
				tags: [SwaggerTag.INGREDIENT, SwaggerTag.MODERATOR],
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
			schema: {
				tags: [SwaggerTag.INGREDIENT, SwaggerTag.MODERATOR]
			},
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
				tags: [SwaggerTag.INGREDIENT, SwaggerTag.MODERATOR],
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
				tags: [SwaggerTag.INGREDIENT, SwaggerTag.MODERATOR],
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
