import userController from '~controllers/user.controller';
import authMiddleware from '~middlewares/auth.middleware';

import { Fastify } from '~types/fastify.type';
import { Role } from '~constants/role.constant';

export default async function authRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/me',
		{
			onRequest: [authMiddleware.requireToken],
			config: {
				allowedRoles: [Role.CUSTOMER, Role.ADMIN]
			},
			preHandler: app.auth([app.authorize])
		},
		userController.getMe
	);
}
