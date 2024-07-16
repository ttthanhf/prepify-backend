import { Role } from '~constants/role.constant';
import authMiddleware from '~middlewares/auth.middleware';
import { Fastify } from '~types/fastify.type';
import orderController from '~controllers/moderator/order.controller';
import { orderModeratorQueryGetRequestSchema } from '~models/schemas/moderator/order.schemas.model';
import { SwaggerTag } from '~constants/swaggertag.constant';

export default async function orderRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/orders',
		{
			schema: {
				tags: [SwaggerTag.MODERATOR, SwaggerTag.ORDER],
				queryString: orderModeratorQueryGetRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		orderController.getOrders
	);

	app.get(
		'/orders/:id',
		{
			schema: {
				tags: [SwaggerTag.MODERATOR, SwaggerTag.ORDER]
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		orderController.getOrderById
	);
}
