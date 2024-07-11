import cartController from '~controllers/cart.controller';
import authMiddleware from '~middlewares/auth.middleware';
import {
	cartCreateRequestSchema,
	cartDeleteRequestSchema,
	cartUpdateRequestSchema
} from '~models/schemas/cart.schemas.model';
import { Fastify } from '~types/fastify.type';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/cart',
		{
			onRequest: [authMiddleware.requireToken]
		},
		cartController.getCart
	);
	app.get(
		'/cart/length',
		{
			onRequest: [authMiddleware.requireToken]
		},
		cartController.getCartLength
	);
	app.post(
		'/cart/add',
		{
			schema: {
				body: cartCreateRequestSchema
			},
			onRequest: [authMiddleware.requireToken]
		},
		cartController.createCart
	);
	app.put(
		'/cart/update',
		{
			schema: {
				body: cartUpdateRequestSchema
			},
			onRequest: [authMiddleware.requireToken]
		},
		cartController.updateCart
	);
	app.post(
		'/cart/delete',
		{
			schema: {
				body: cartDeleteRequestSchema
			},
			onRequest: [authMiddleware.requireToken]
		},
		cartController.deleteCart
	);
}
