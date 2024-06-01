import ingredientController from '~controllers/ingredient.controller';
import ingredientSchemasModel from '~models/schemas/ingredient.schemas.model';
import { Fastify } from '~types/fastify.type';

export default async function recipeRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/ingredients',
		{
			schema: {
				querystring: ingredientSchemasModel.ingredientSchemaObj.valueOf()
			}
		},
		ingredientController.getIngredient
	);
}
