import foodStyleController from '~controllers/foodStyle.controller';
import { Fastify } from '~types/fastify.type';

export default async function foodStyleRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get('/food-styles', foodStyleController.getFoodStyle);
}
