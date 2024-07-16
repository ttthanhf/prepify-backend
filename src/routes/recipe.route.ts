import { Fastify } from '~types/fastify.type';
import recipeController from '~controllers/recipe.controller';
import { recipeQueryGetRequestSchema } from '~models/schemas/recipe.schemas.model';
import { SwaggerTag } from '~constants/swaggertag.constant';

export default async function recipeRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/recipes',
		{
			schema: {
				tags: [SwaggerTag.RECIPE],
				querystring: recipeQueryGetRequestSchema
			}
		},
		recipeController.getAllRecipe
	);
	app.get(
		'/recipes/:slug',
		{
			schema: {
				tags: [SwaggerTag.RECIPE]
			}
		},
		recipeController.getRecipe
	);
}
