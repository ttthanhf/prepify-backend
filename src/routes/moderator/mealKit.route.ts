import { Role } from '~constants/role.constant';
import { SwaggerTag } from '~constants/swaggertag.constant';
import mealkitController from '~controllers/moderator/mealkit.controller';
import authMiddleware from '~middlewares/auth.middleware';
import {
	mealKitModeratorCreateRequestSchema,
	mealKitModeratorGetRequestSchema,
	mealKitModeratorUpdateRequestSchema
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
				tags: [SwaggerTag.MEALKIT, SwaggerTag.MODERATOR],
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
			schema: {
				tags: [SwaggerTag.MEALKIT, SwaggerTag.MODERATOR]
			},
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
				tags: [SwaggerTag.MEALKIT, SwaggerTag.MODERATOR],
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
			schema: {
				tags: [SwaggerTag.MEALKIT, SwaggerTag.MODERATOR],
				body: mealKitModeratorUpdateRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		mealkitController.updateMealKit
	);

	app.put(
		'/mealkits/:id/status/toggle',
		{
			schema: {
				tags: [SwaggerTag.MEALKIT, SwaggerTag.MODERATOR]
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		mealkitController.toggleStatus
	);
}
