import {
	categoryModeratorQueryCreateRequestSchema,
	categoryModeratorQueryGetRequestSchema,
	categoryModeratorQueryUpdateRequestSchema
} from '~models/schemas/moderator/category.schemas.model';
import authMiddleware from '~middlewares/auth.middleware';
import { Role } from '~constants/role.constant';
import { Fastify } from '~types/fastify.type';
import categoryController from '~controllers/moderator/category.controller';
import { SwaggerTag } from '~constants/swaggertag.constant';

export default async function categoryRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/categories',
		{
			schema: {
				tags: [SwaggerTag.MODERATOR, SwaggerTag.CATEGORY],
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
				tags: [SwaggerTag.MODERATOR, SwaggerTag.CATEGORY],
				body: categoryModeratorQueryCreateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		categoryController.createCategory
	);

	app.put(
		'/categories/:id',
		{
			schema: {
				tags: [SwaggerTag.MODERATOR, SwaggerTag.CATEGORY],
				body: categoryModeratorQueryUpdateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		categoryController.updateCategory
	);

	app.delete(
		'/categories/:id',
		{
			schema: {
				tags: [SwaggerTag.MODERATOR, SwaggerTag.CATEGORY]
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		categoryController.deleteCategory
	);
}
