import ingredientController from '~controllers/ingredient.controller';
import { ingredientGetRequestSchema } from '~models/schemas/ingredient.schemas.model';
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
				querystring: ingredientGetRequestSchema
			}
		},
		ingredientController.getIngredient
	);
}
