import authMiddleware from '~middlewares/auth.middleware';
import { Fastify } from '~types/fastify.type';
import { uploadDeleteRequestSchema } from '~models/schemas/moderator/upload.schemas.model';
import uploadController from '~controllers/upload.controller';

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
			onRequest: [authMiddleware.requireToken]
		},
		uploadController.uploadImage
	);

	app.post(
		'/upload/delete',
		{
			schema: {
				body: uploadDeleteRequestSchema
			},
			onRequest: [authMiddleware.requireToken]
		},
		uploadController.deleteImage
	);
}
