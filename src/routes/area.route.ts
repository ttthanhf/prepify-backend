import { SwaggerTag } from '~constants/swaggertag.constant';
import areaController from '~controllers/area.controller';
import authMiddleware from '~middlewares/auth.middleware';
import { Fastify } from '~types/fastify.type';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/area',
		{
			schema: {
				tags: [SwaggerTag.AREA],
				onRequest: [authMiddleware.requireToken]
			}
		},
		areaController.getAllArea
	);
}
