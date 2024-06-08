import { Fastify } from '~types/fastify.type';
import categoryController from '~controllers/category.controller';

export default async function recipeRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get('/categories', categoryController.getCategory);
}
