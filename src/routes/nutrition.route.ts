import nutritionController from '~controllers/nutrition.controller';
import { Fastify } from '~types/fastify.type';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get('/nutrition', nutritionController.getNutrition);
}
