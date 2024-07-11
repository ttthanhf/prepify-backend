import { Role } from '~constants/role.constant';
import authMiddleware from '~middlewares/auth.middleware';
import { Fastify } from '~types/fastify.type';
import expoPushTokenController from '~controllers/expoPushToken.controller';
import { expoPushTokenSaveRequestSchema } from '~models/schemas/expoPushToken.schemas.model';
import { SwaggerTag } from '~constants/swaggertag.constant';

export default async function expoPushTokenRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.post(
		'/expo-push-token',
		{
			schema: {
				tags: [SwaggerTag.EXPO],
				body: expoPushTokenSaveRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.ADMIN, Role.SHIPPER]
			}
		},
		expoPushTokenController.savePushToken
	);

	app.get(
		'/expo-push-token/:device_id',
		{
			schema: {
				tags: [SwaggerTag.EXPO]
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.ADMIN, Role.SHIPPER]
			}
		},
		expoPushTokenController.getPushTokenByDeviceId
	);
}
