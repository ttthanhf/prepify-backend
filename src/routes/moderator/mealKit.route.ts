import { Role } from '~constants/role.constant';
import mealkitController from '~controllers/moderator/mealkit.controller';
import authMiddleware from '~middlewares/auth.middleware';
import {
	mealKitModeratorCreateRequestSchema,
	mealKitModeratorGetRequestSchema
} from '~models/schemas/moderator/mealkit.schemas.model';
import { Fastify } from '~types/fastify.type';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/mealkits',
		{
			schema: {
				querystring: mealKitModeratorGetRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		mealkitController.getAllMealkit
	);
	app.get(
		'/mealkits/:id',
		{
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		mealkitController.getMealkit
	);
	app.post(
		'/mealkits',
		{
			schema: {
				body: mealKitModeratorCreateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		mealkitController.createMealkit
	);
	app.put(
		'/mealkits/:id',
		{
			// schema: {
			// 	body: mealKitModeratorCreateRequestSchema
			// },
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		mealkitController.createMealkit
	);

	app.put(
		'/mealkits/:id/status/toggle',
		{
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		mealkitController.toggleStatus
	);
}
