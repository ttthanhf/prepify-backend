import { Role } from '~constants/role.constant';
import authMiddleware from '~middlewares/auth.middleware';
import { unitModeratorQueryGetRequestSchema } from '~models/schemas/moderator/unit.schemas.model';
import { Fastify } from '~types/fastify.type';
import unitController from '~controllers/moderator/unit.controller';

export default async function categoryRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/units',
		{
			schema: {
				queryString: unitModeratorQueryGetRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		unitController.getUnit
	);
}
