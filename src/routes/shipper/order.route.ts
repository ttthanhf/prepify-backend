import { Role } from '~constants/role.constant';
import { SwaggerTag } from '~constants/swaggertag.constant';
import orderController from '~controllers/shipper/order.controller';
import authMiddleware from '~middlewares/auth.middleware';
import {
	orderShipperGetRequestSchema,
	orderShipperUpdateRequestSchema
} from '~models/schemas/shipper/order.schemas.model';
import { Fastify } from '~types/fastify.type';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/orders/current-batch',
		{
			schema: {
				tags: [SwaggerTag.ORDER, SwaggerTag.SHIPPER],
				queryString: orderShipperGetRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.SHIPPER]
			}
		},
		orderController.getOrdersInCurrentBatch
	);

	app.put(
		'/orders/:id',
		{
			schema: {
				tags: [SwaggerTag.ORDER, SwaggerTag.SHIPPER],
				body: orderShipperUpdateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.SHIPPER]
			}
		},
		orderController.updateOrder
	);

	app.get(
		'/orders/number',
		{
			schema: {
				tags: [SwaggerTag.ORDER, SwaggerTag.SHIPPER]
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.SHIPPER]
			}
		},
		orderController.getNumberOfOrdersByStatus
	);
}
