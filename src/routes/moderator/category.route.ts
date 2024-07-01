import {
	categoryModeratorQueryCreateRequestSchema,
	categoryModeratorQueryGetRequestSchema
} from '~models/schemas/moderator/category.schemas.model';
import authMiddleware from '~middlewares/auth.middleware';
import { Role } from '~constants/role.constant';
import { Fastify } from '~types/fastify.type';
import categoryController from '~controllers/moderator/category.controller';

export default async function recipeRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/categories',
		{
			schema: {
				queryString: categoryModeratorQueryGetRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		categoryController.getCategory
	);

	app.post(
		'/categories',
		{
			schema: {
				body: categoryModeratorQueryCreateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		categoryController.createCategory
	);
}
