import { Role } from '~constants/role.constant';
import authMiddleware from '~middlewares/auth.middleware';
import { Fastify } from '~types/fastify.type';
import { uploadDeleteRequestSchema } from '~models/schemas/moderator/upload.schemas.model';
import uploadController from '~controllers/moderator/upload.controller';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.post(
		'/upload/create',
		{
			schema: {
				consumes: ['multipart/form-data']
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		uploadController.uploadImage
	);

	app.post(
		'/upload/delete',
		{
			schema: {
				body: uploadDeleteRequestSchema
			},
			onRequest: [authMiddleware.requireToken, authMiddleware.verifyRole],
			config: {
				allowedRoles: [Role.MODERATOR]
			}
		},
		uploadController.deleteImage
	);
}
