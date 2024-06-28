import tempController from '~controllers/temp.controller';

import { Fastify } from '~types/fastify.type';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get('/area', tempController.getArea);
	app.get('/shipping-date', tempController.getShippingDate);
	app.get('/cooking-level', tempController.getCookingLevel);
	app.get('/order-status', tempController.getOrderStatus);
	app.get('/payments', tempController.getPayment);
}
