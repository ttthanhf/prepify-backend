import authMiddleware from '~middlewares/auth.middleware';
import { Fastify } from '~types/fastify.type';
import { uploadDeleteRequestSchema } from '~models/schemas/moderator/upload.schemas.model';
import uploadController from '~controllers/upload.controller';
import { SwaggerTag } from '~constants/swaggertag.constant';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.post(
		'/upload/create',
		{
			schema: {
				tags: [SwaggerTag.UPLOAD],
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
				tags: [SwaggerTag.UPLOAD],
				body: uploadDeleteRequestSchema
			},
			onRequest: [authMiddleware.requireToken]
		},
		uploadController.deleteImage
	);
}
