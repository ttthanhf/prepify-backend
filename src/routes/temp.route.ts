import { SwaggerTag } from '~constants/swaggertag.constant';
import tempController from '~controllers/temp.controller';

import { Fastify } from '~types/fastify.type';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/shipping-date',
		{
			schema: {
				tags: [SwaggerTag.ACHIEVE]
			}
		},
		tempController.getShippingDate
	);
	app.get(
		'/cooking-level',
		{
			schema: {
				tags: [SwaggerTag.ACHIEVE]
			}
		},
		tempController.getCookingLevel
	);
}
