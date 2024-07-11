import { Role } from '~constants/role.constant';
import { SwaggerTag } from '~constants/swaggertag.constant';
import configController from '~controllers/moderator/config.controller';
import authMiddleware from '~middlewares/auth.middleware';
import { configUpdateRequestSchema } from '~models/schemas/moderator/config.schemas.model';
import { Fastify } from '~types/fastify.type';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/config',
		{
			schema: {
				tags: [SwaggerTag.MODERATOR, SwaggerTag.CONFIG]
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		configController.getAllConfig
	);
	app.put(
		'/config/:id',
		{
			schema: {
				tags: [SwaggerTag.MODERATOR, SwaggerTag.CONFIG],
				body: configUpdateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		configController.updateConfig
	);
}
