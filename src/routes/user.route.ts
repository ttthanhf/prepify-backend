import userController from '~controllers/user.controller';
import authMiddleware from '~middlewares/auth.middleware';

import { Fastify } from '~types/fastify.type';

export default async function authRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/me',
		{
			preHandler: [authMiddleware.requireToken]
		},
		userController.getMe
	);
}
