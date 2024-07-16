import { SwaggerTag } from '~constants/swaggertag.constant';
import paymentController from '~controllers/payment.controller';
import authMiddleware from '~middlewares/auth.middleware';
import { VNPayGetSchema } from '~models/schemas/payment.schemas.model';
import { Fastify } from '~types/fastify.type';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/payment',
		{
			schema: {
				tags: [SwaggerTag.PAYMENT]
			},
			onRequest: [authMiddleware.requireToken]
		},
		paymentController.getPaymentUrl
	);
	app.get(
		'/payment/verify',
		{
			schema: {
				tags: [SwaggerTag.PAYMENT],
				querystring: VNPayGetSchema
			},
			onRequest: [authMiddleware.requireToken]
		},
		paymentController.verifyPayment
	);

	app.get(
		'/payments',
		{
			schema: {
				tags: [SwaggerTag.PAYMENT]
			}
		},
		paymentController.getPayment
	);
}
