import { Fastify } from '~types/fastify.type';
import categoryController from '~controllers/category.controller';
import { SwaggerTag } from '~constants/swaggertag.constant';

export default async function recipeRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/categories',
		{
			schema: {
				tags: [SwaggerTag.CATEGORY]
			}
		},
		categoryController.getCategory
	);
}
