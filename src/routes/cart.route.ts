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
		'/carts',
		{
			onRequest: [authMiddleware.requireToken]
		},
		cartController.getCart
	);
	app.post(
		'/carts',
		{
			schema: {
				body: cartCreateRequestSchema
			},
			onRequest: [authMiddleware.requireToken]
		},
		cartController.createCart
	);
	app.put(
		'/carts',
		{
			schema: {
				body: cartUpdateRequestSchema
			},
			onRequest: [authMiddleware.requireToken]
		},
		cartController.updateCart
	);
	app.delete(
		'/carts/:cartId',
		{
			schema: {
				params: cartDeleteRequestSchema
			},
			onRequest: [authMiddleware.requireToken]
		},
		cartController.deleteCart
	);
}
