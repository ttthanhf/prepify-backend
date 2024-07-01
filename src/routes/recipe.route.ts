import { Fastify } from '~types/fastify.type';
import recipeController from '~controllers/recipe.controller';
import { recipeQueryGetRequestSchema } from '~models/schemas/recipe.schemas.model';

export default async function recipeRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/recipes',
		{
			schema: {
				querystring: recipeQueryGetRequestSchema
			}
		},
		recipeController.getRecipe
	);
}
