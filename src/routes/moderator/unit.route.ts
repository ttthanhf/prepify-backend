import { Role } from '~constants/role.constant';
import authMiddleware from '~middlewares/auth.middleware';
import {
	unitModeratorQueryCreateRequestSchema,
	unitModeratorQueryGetRequestSchema,
	unitModeratorQueryUpdateRequestSchema
} from '~models/schemas/moderator/unit.schemas.model';
import { Fastify } from '~types/fastify.type';
import unitController from '~controllers/moderator/unit.controller';
import { SwaggerTag } from '~constants/swaggertag.constant';

export default async function unitRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/units',
		{
			schema: {
				tags: [SwaggerTag.MODERATOR, SwaggerTag.UNIT],
				queryString: unitModeratorQueryGetRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		unitController.getUnit
	);

	app.post(
		'/units',
		{
			schema: {
				tags: [SwaggerTag.MODERATOR, SwaggerTag.UNIT],
				body: unitModeratorQueryCreateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		unitController.createUnit
	);

	app.put(
		'/units/:id',
		{
			schema: {
				tags: [SwaggerTag.MODERATOR, SwaggerTag.UNIT],
				body: unitModeratorQueryUpdateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		unitController.updateUnit
	);

	app.delete(
		'/units/:id',
		{
			schema: {
				tags: [SwaggerTag.MODERATOR, SwaggerTag.UNIT]
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		unitController.deleteUnit
	);
}
