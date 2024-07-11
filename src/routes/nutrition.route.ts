import { SwaggerTag } from '~constants/swaggertag.constant';
import nutritionController from '~controllers/nutrition.controller';
import { Fastify } from '~types/fastify.type';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/nutrition',
		{
			schema: {
				tags: [SwaggerTag.NUTRITION]
			}
		},
		nutritionController.getNutrition
	);
}
