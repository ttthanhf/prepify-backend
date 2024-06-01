import { Fastify } from '~types/fastify.type';
import categoryController from '~controllers/category.controller';
import categorySchemasModel from '~models/schemas/category.schemas.model';

export default async function recipeRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/categories',
		{
			schema: {
				querystring: categorySchemasModel.categorySchemaObj.valueOf()
			}
		},
		categoryController.getCategory
	);
}
