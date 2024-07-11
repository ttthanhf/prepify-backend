import { SwaggerTag } from '~constants/swaggertag.constant';
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
			schema: {
				tags: [SwaggerTag.CART]
			},
			onRequest: [authMiddleware.requireToken]
		},
		cartController.getCart
	);
	app.get(
		'/cart/length',
		{
			schema: {
				tags: [SwaggerTag.CART]
			},
			onRequest: [authMiddleware.requireToken]
		},
		cartController.getCartLength
	);
	app.post(
		'/cart/add',
		{
			schema: {
				tags: [SwaggerTag.CART],
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
				tags: [SwaggerTag.CART],
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
				tags: [SwaggerTag.CART],
				body: cartDeleteRequestSchema
			},
			onRequest: [authMiddleware.requireToken]
		},
		cartController.deleteCart
	);
}
