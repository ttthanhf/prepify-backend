import { Role } from '~constants/role.constant';
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
		'/orders/batch/:id',
		{
			schema: {
				queryString: orderShipperGetRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.SHIPPER]
			}
		},
		orderController.getOrdersInBatch
	);

	app.put(
		'/orders/:id',
		{
			schema: {
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
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.SHIPPER]
			}
		},
		orderController.getNumberOfOrdersByStatus
	);
}
