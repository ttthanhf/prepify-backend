import { VNPAY_CONFIG } from '~configs/payment.config';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import crypto from 'crypto';
import ResponseModel from '~models/responses/response.model';

import dateUtil from '~utils/date.util';
import objectUtil from '~utils/object.util';
import numberUtil from '~utils/number.util';
import userUtil from '~utils/user.util';
import orderRepository from '~repositories/order.repository';
import { OrderStatus } from '~constants/orderstatus.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { VNPayGet } from '~models/schemas/payment.schemas.model';
import RabbitMQUtil from '~utils/rabbitmq.util';
import { RABBITMQ_CONSTANT } from '~constants/rabbitmq.constant';
import mealKitRepository from '~repositories/mealKit.repository';
import paymentRepository from '~repositories/payment.repository';

class PaymentService {
	async getPaymentUrlHandle(req: FastifyRequest, res: FastifyResponse) {
		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);
		const order = await orderRepository.findOne({
			where: {
				status: OrderStatus.WAITING,
				customer: {
					id: customer!.id
				}
			},
			relations: ['customer']
		});

		const response = new ResponseModel(res);
		if (!order) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			response.message = 'Order not found';
			return response.send();
		}

		let vnp_params: {
			vnp_Version: string;
			vnp_Command: string;
			vnp_TmnCode: string;
			vnp_Locale: string;
			vnp_CurrCode: string;
			vnp_TxnRef: number;
			vnp_OrderInfo: string;
			vnp_Amount: number;
			vnp_ReturnUrl: string;
			vnp_IpAddr: string;
			vnp_CreateDate: string;
			vnp_SecureHash?: string;
			vnp_OrderType: string;
		} = {
			vnp_Version: '2.1.0',
			vnp_Command: 'pay',
			vnp_TmnCode: VNPAY_CONFIG.vnp_TmnCode,
			vnp_Locale: 'vn',
			vnp_CurrCode: 'VND',
			vnp_TxnRef: numberUtil.generateRandomNumber(8),
			vnp_OrderInfo: order!.id,
			vnp_Amount: order!.totalPrice * 100,
			vnp_ReturnUrl: VNPAY_CONFIG.vnp_ReturnUrl,
			vnp_IpAddr: '::1',
			vnp_CreateDate: dateUtil.formatDateToYYYYMMDDHHMMSS(new Date()),
			vnp_OrderType: 'other'
		};

		vnp_params = objectUtil.sortObject(vnp_params);

		const queryString = objectUtil.objectToQueryString(vnp_params);

		const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.vnp_SecureHash);
		const secureHash = hmac
			.update(Buffer.from(queryString, 'utf-8'))
			.digest('hex');

		vnp_params.vnp_SecureHash = secureHash;

		const paymentUrl = `${VNPAY_CONFIG.vnp_Url}?${objectUtil.objectToQueryString(vnp_params)}`;

		response.data = {
			url: paymentUrl
		};
		return response.send();
	}

	async getPaymentHandle(req: FastifyRequest, res: FastifyResponse) {
		const payment = await paymentRepository.findAll();
		const response = new ResponseModel(res);
		response.data = payment;
		return response.send();
	}

	async verifyPaymentHandle(req: FastifyRequest, res: FastifyResponse) {
		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);
		const query: VNPayGet = req.query as VNPayGet;

		const vnp_params = objectUtil.objectToQueryString(
			objectUtil.hideProperties(
				objectUtil.sortObject(query),
				'vnp_SecureHash',
				'vnp_SecureHashType'
			)
		);

		const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.vnp_SecureHash);
		const secureHash = hmac
			.update(Buffer.from(vnp_params.replaceAll('%20', '+'), 'utf-8'))
			.digest('hex');

		const response = new ResponseModel(res);

		if (secureHash == query.vnp_SecureHash) {
			const order = await orderRepository.findOne({
				where: {
					id: query.vnp_OrderInfo,
					customer: {
						id: customer!.id
					}
				},
				relations: ['customer']
			});

			if (!order) {
				response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
				response.message = 'Order not found';
				response.data = {
					success: false,
					error: false
				};
				return response.send();
			}

			// ORDER SUCCESS
			if (order.status == OrderStatus.WAITING) {
				order.status = OrderStatus.CREATED;
				await orderRepository.update(order);
				const rabbitmqInstance = await RabbitMQUtil.getInstance();
				// if the order is paid successfully, publish a message to the order create exchange
				await rabbitmqInstance.publishMessage(
					RABBITMQ_CONSTANT.EXCHANGE.ORDER_CREATE,
					RABBITMQ_CONSTANT.ROUTING_KEY.ORDER_CREATE,
					JSON.stringify(order)
				);
				response.data = {
					success: true,
					error: false
				};

				const mealKits = await mealKitRepository.find({
					where: {
						orderDetails: {
							order: {
								id: order.id
							}
						}
					}
				});

				for (const mealKit of mealKits) {
					mealKit.sold = mealKit.sold + 1;
					await mealKitRepository.update(mealKit);
				}

				return response.send();
			} else if (order.status == OrderStatus.CREATED) {
				response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
				response.message = 'Order already success';
				response.data = {
					success: false,
					error: true
				};
				return response.send();
			}
		} else {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Sign data not correct';
			response.data = {
				success: false,
				error: true
			};
			return response.send();
		}
	}
}
export default new PaymentService();
