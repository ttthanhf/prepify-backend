import userController from '~controllers/user.controller';
import authMiddleware from '~middlewares/auth.middleware';

import { Fastify } from '~types/fastify.type';
import { Role } from '~constants/role.constant';
import { userUpdateRequestSchema } from '~models/schemas/user.schemas.model';
import { SwaggerTag } from '~constants/swaggertag.constant';

export default async function authRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/me',
		{
			schema: {
				tags: [SwaggerTag.USER]
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.CUSTOMER, Role.ADMIN, Role.SHIPPER, Role.MODERATOR]
			}
		},
		userController.getMe
	);
	app.put(
		'/me',
		{
			schema: {
				tags: [SwaggerTag.USER],
				body: userUpdateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.CUSTOMER, Role.ADMIN, Role.SHIPPER, Role.MODERATOR]
			}
		},
		userController.updateMe
	);
}
