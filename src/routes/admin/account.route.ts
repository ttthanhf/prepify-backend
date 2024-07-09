import authMiddleware from '~middlewares/auth.middleware';
import { Role } from '~constants/role.constant';
import { Fastify } from '~types/fastify.type';
import accountController from '~controllers/admin/admin.controller';
import {
	accountAdminQueryCreateRequestSchema,
	accountAdminQueryGetRequestSchema
} from '~models/schemas/admin/account.schemas.model';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/accounts',
		{
			schema: {
				queryString: accountAdminQueryGetRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.ADMIN]
			}
		},
		accountController.getAllAccount
	);

	app.post(
		'/accounts',
		{
			schema: {
				body: accountAdminQueryCreateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.ADMIN]
			}
		},
		accountController.createAccount
	);
}
