import authMiddleware from '~middlewares/auth.middleware';
import { Role } from '~constants/role.constant';
import { Fastify } from '~types/fastify.type';
import {
	foodStyleModeratorQueryCreateRequestSchema,
	foodStyleModeratorQueryGetRequestSchema,
	foodStyleModeratorQueryUpdateRequestSchema
} from '~models/schemas/moderator/foodStyle.schemas.model';
import foodStyleController from '~controllers/moderator/foodStyle.controller';

export default async function categoryRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/food-styles',
		{
			schema: {
				queryString: foodStyleModeratorQueryGetRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		foodStyleController.getFoodStyle
	);

	app.post(
		'/food-styles',
		{
			schema: {
				queryString: foodStyleModeratorQueryCreateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		foodStyleController.createFoodStyle
	);

	app.put(
		'/food-styles/:id',
		{
			schema: {
				queryString: foodStyleModeratorQueryUpdateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		foodStyleController.updateFoodStyle
	);

	app.delete(
		'/food-styles/:id',
		{
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		foodStyleController.deleteFoodStyle
	);
}
