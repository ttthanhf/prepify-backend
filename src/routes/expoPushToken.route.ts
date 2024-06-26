import { Role } from '~constants/role.constant';
import authMiddleware from '~middlewares/auth.middleware';
import { Fastify } from '~types/fastify.type';
import expoPushTokenController from '~controllers/expoPushToken.controller';
import { expoPushTokenSaveRequestSchema } from '~models/schemas/expoPushToken.schemas.model';

export default async function expoPushTokenRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.post(
		'/expo-push-token',
		{
			schema: {
				body: expoPushTokenSaveRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.CUSTOMER, Role.SHIPPER]
			}
		},
		expoPushTokenController.savePushToken
	);
}
