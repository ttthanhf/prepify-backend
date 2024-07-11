import { Role } from '~constants/role.constant';
import batchController from '~controllers/shipper/batch.controller';
import authMiddleware from '~middlewares/auth.middleware';
import { batchShipperUpdateRequestSchema } from '~models/schemas/shipper/batch.schemas.model';
import { Fastify } from '~types/fastify.type';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.put(
		'/batches/:id/pickup',
		{
			schema: {
				queryString: batchShipperUpdateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.SHIPPER]
			}
		},
		batchController.pickUpBatch
	);

	app.get(
		'/batches',
		{
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.SHIPPER]
			}
		},
		batchController.getBatchesByShipperArea
	);
}
