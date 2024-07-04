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
			onRequest: [authMiddleware.requireToken]
		},
		paymentController.getPaymentUrl
	);
	app.get(
		'/payment/verify',
		{ schema: VNPayGetSchema, onRequest: [authMiddleware.requireToken] },
		paymentController.verifyPayment
	);
}
