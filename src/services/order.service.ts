import { FastifyRequest } from 'fastify';
import { DeliveryMethod } from '~constants/deliverymethod.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { OrderStatus } from '~constants/orderstatus.constant';
import { OrderDetail } from '~models/entities/order-detail.entity';
import { Order } from '~models/entities/order.entity';
import { ItemResponse } from '~models/responses/checkout.response.model';
import ResponseModel from '~models/responses/response.model';
import { OrderCreateRequest } from '~models/schemas/order.schemas.model';
import areaRepository from '~repositories/area.repository';
import mealKitRepository from '~repositories/mealKit.repository';
import orderRepository from '~repositories/order.repository';
import orderDetailRepository from '~repositories/orderDetail.repository';
import paymentRepository from '~repositories/payment.repository';
import userRepository from '~repositories/user.repository';
import { FastifyResponse } from '~types/fastify.type';
import redisUtil from '~utils/redis.util';
import userUtil from '~utils/user.util';

class OrderService {
	async orderHandle(req: FastifyRequest, res: FastifyResponse) {
		const orderCreateRequest: OrderCreateRequest =
			req.body as OrderCreateRequest;
		const response = new ResponseModel(res);

		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);
		const user = await userUtil.getUserByTokenInHeader(req.headers);

		const checkout = await redisUtil.getCheckout(customer!);

		if (!checkout) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'No item in checkout';
			return response.send();
		}

		if (!user!.address) {
			user!.address = orderCreateRequest.address;
		}
		if (!user!.phone) {
			user!.phone = orderCreateRequest.phone;
		}

		let totalPrice = 0;
		let checkoutItems: OrderDetail[] = [];

		const order = new Order();

		await checkout.items.forEach(async (item: ItemResponse) => {
			const checkoutItem = await orderDetailRepository.findOne({
				where: {
					id: item.id,
					customer: {
						id: customer?.id
					}
				},
				relations: ['customer', 'mealKit']
			});
			checkoutItem!.isCart = false;
			checkoutItem!.price = checkoutItem!.mealKit.price;
			checkoutItem!.order = order;
			checkoutItems.push(checkoutItem!);

			//cal total price
			totalPrice += checkoutItem!.price * checkoutItem!.quantity;

			if (checkoutItem!.has_extra_spice) {
				const mealKit = await mealKitRepository.findOne({
					where: {
						id: checkoutItem!.mealKit.id
					},
					relations: ['extraSpice'],
					select: {
						extraSpice: {
							price: true
						}
					}
				});

				totalPrice += mealKit!.extraSpice!.price * checkoutItem!.quantity;
			}
		});

		const area = await areaRepository.findOneBy({
			id: orderCreateRequest.areaId
		});

		user!.area = area!;

		await userRepository.update(user!);

		totalPrice +=
			orderCreateRequest.deliveryMethod == DeliveryMethod.INSTANT
				? area!.instantPrice
				: area!.standardPrice;

		const payment = await paymentRepository.findOneBy({
			id: orderCreateRequest.paymentId
		});

		order.customer = customer!;
		order.area = area!;
		order.address = orderCreateRequest.address;
		order.datetime = new Date();
		order.totalPrice = totalPrice;
		order.phone = user!.phone;
		order.payment = payment!;
		order.note = orderCreateRequest.note ?? undefined;

		await orderRepository.create(order);
		await redisUtil.removeCheckout(customer!);
		checkoutItems.forEach(async (checkoutItem) => {
			await orderDetailRepository.update(checkoutItem!);
		});

		return response.send();
	}
}

export default new OrderService();
