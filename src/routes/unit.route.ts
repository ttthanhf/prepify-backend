import { SwaggerTag } from '~constants/swaggertag.constant';
import unitController from '~controllers/unit.controller';
import { Fastify } from '~types/fastify.type';

export default async function recipeRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/units',
		{
			schema: {
				tags: [SwaggerTag.UNIT]
			}
		},
		unitController.getUnit
	);
}
