import foodStyleController from '~controllers/foodStyle.controller';
import foodStyleSchemasModel from '~models/schemas/foodStyle.schemas.model';
import { Fastify } from '~types/fastify.type';

export default async function foodStyleRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/food-styles',
		{
			schema: {
				querystring: foodStyleSchemasModel.foodStyleSchemaObj.valueOf()
			}
		},
		foodStyleController.getFoodStyle
	);
}
