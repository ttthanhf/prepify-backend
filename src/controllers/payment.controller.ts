import { FastifyRequest } from 'fastify';
import paymentService from '~services/payment.service';
import { FastifyResponse } from '~types/fastify.type';

class PaymentController {
	async getPaymentUrl(req: FastifyRequest, res: FastifyResponse) {
		await paymentService.getPaymentUrlHandle(req, res);
	}

	async verifyPayment(req: FastifyRequest, res: FastifyResponse) {
		await paymentService.verifyPaymentHandle(req, res);
	}

	async getPayment(req: FastifyRequest, res: FastifyResponse) {
		return paymentService.getPaymentHandle(req, res);
	}
}
export default new PaymentController();
