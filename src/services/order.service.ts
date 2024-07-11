import { FastifyRequest } from 'fastify';
import { In } from 'typeorm';
import { DEFAULT_IMAGE } from '~constants/default.constant';
import { DeliveryMethod } from '~constants/deliverymethod.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { ImageType } from '~constants/image.constant';
import { OrderStatus } from '~constants/orderstatus.constant';
import { RABBITMQ_CONSTANT } from '~constants/rabbitmq.constant';
import { OrderDetail } from '~models/entities/order-detail.entity';
import { Order } from '~models/entities/order.entity';
import { ItemResponse } from '~models/responses/checkout.response.model';
import {
	OrderDetailResponse,
	OrderItemResponse,
	OrderResponse
} from '~models/responses/order.response.model';
import ResponseModel from '~models/responses/response.model';
import { OrderCreateRequest } from '~models/schemas/order.schemas.model';
import areaRepository from '~repositories/area.repository';
import imageRepository from '~repositories/image.repository';
import mealKitRepository from '~repositories/mealKit.repository';
import orderRepository from '~repositories/order.repository';
import orderDetailRepository from '~repositories/orderDetail.repository';
import paymentRepository from '~repositories/payment.repository';
import userRepository from '~repositories/user.repository';
import { FastifyResponse } from '~types/fastify.type';
import mapperUtil from '~utils/mapper.util';
import RabbitMQUtil from '~utils/rabbitmq.util';
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
		// order.datetime = getCurrentDatetime();
		order.totalPrice = totalPrice;
		order.phone = user!.phone;
		order.payment = payment!;
		order.note = orderCreateRequest.note ?? undefined;
		order.isPriority =
			orderCreateRequest.deliveryMethod == DeliveryMethod.INSTANT;

		await orderRepository.create(order);
		await redisUtil.removeCheckout(customer!);
		checkoutItems.forEach(async (checkoutItem) => {
			await orderDetailRepository.update(checkoutItem!);
		});

		const rabbitmqInstance = await RabbitMQUtil.getInstance();
		// if the order is not paid during 1 hour, cancel the order
		await rabbitmqInstance.publishMessageToDelayQueue(
			RABBITMQ_CONSTANT.EXCHANGE.ORDER_CANCEL,
			RABBITMQ_CONSTANT.ROUTING_KEY.ORDER_CANCEL,
			JSON.stringify(order),
			60 * 60 * 1000 // 1 hour
		);

		return response.send();
	}

	async getAllOrderHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: any = req.query;
		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);
		const orders = await orderRepository.find({
			where: {
				customer: {
					id: customer!.id
				},
				status:
					query.tab == OrderStatus.DELAYED ||
					query.tab == OrderStatus.DELIVERING
						? In([OrderStatus.DELIVERING, OrderStatus.DELAYED])
						: query.tab
			},
			order: {
				datetime: 'DESC'
			},
			relations: [
				'customer',
				'orderDetails',
				'orderDetails.mealKit',
				'orderDetails.mealKit.extraSpice',
				'orderDetails.mealKit.recipe'
			]
		});

		const orderResponseList: Array<OrderResponse> = [];
		for (const order of orders) {
			const orderResponse = mapperUtil.mapEntityToClass(order, OrderResponse);
			orderResponse.orderDate = order.datetime;

			const orderItemResponseList: Array<OrderItemResponse> = [];
			for (const orderDetail of order.orderDetails) {
				const orderItemResponse = mapperUtil.mapEntityToClass(
					orderDetail.mealKit,
					OrderItemResponse
				);

				orderItemResponse.name = orderDetail.mealKit.recipe.name;
				orderItemResponse.slug = orderDetail.mealKit.recipe.slug;
				orderItemResponse.quantity = orderDetail.quantity;

				const image = await imageRepository.findOneBy({
					type: ImageType.RECIPE,
					entityId: orderDetail.mealKit.recipe.id
				});

				if (image) {
					orderItemResponse.image = image.url;
				} else {
					orderItemResponse.image = DEFAULT_IMAGE;
				}

				if (orderDetail.mealKit.extraSpice && orderItemResponse.extraSpice) {
					const image = await imageRepository.findOneBy({
						type: ImageType.EXTRASPICE,
						entityId: orderDetail.mealKit.extraSpice.id
					});

					if (image) {
						orderItemResponse.extraSpice.image = image.url;
					} else {
						orderItemResponse.extraSpice.image = DEFAULT_IMAGE;
					}
				}

				orderItemResponseList.push(orderItemResponse);
			}

			orderResponse.orderItems = orderItemResponseList;
			orderResponseList.push(orderResponse);
		}

		const response = new ResponseModel(res);
		response.data = orderResponseList;
		return response.send();
	}

	async getOrderHandle(req: FastifyRequest, res: FastifyResponse) {
		const { id }: any = req.params;
		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);
		const order = await orderRepository.findOne({
			where: {
				customer: {
					id: customer!.id
				},
				id
			},
			relations: [
				'customer',
				'orderDetails',
				'payment',
				'area',
				'orderDetails.order',
				'orderDetails.mealKit',
				'orderDetails.mealKit.extraSpice',
				'orderDetails.mealKit.recipe'
			]
		});

		const response = new ResponseModel(res);

		if (!order) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}
		const orderDetailResponse = mapperUtil.mapEntityToClass(
			order,
			OrderDetailResponse
		);
		orderDetailResponse.orderDate = order.datetime;
		orderDetailResponse.deliveryPrice = order.isPriority
			? order.area.instantPrice
			: order.area.standardPrice;

		const orderItemResponseList: Array<OrderItemResponse> = [];
		for (const orderDetail of order.orderDetails) {
			const orderItemResponse = mapperUtil.mapEntityToClass(
				orderDetail.mealKit,
				OrderItemResponse
			);

			orderItemResponse.name = orderDetail.mealKit.recipe.name;
			orderItemResponse.slug = orderDetail.mealKit.recipe.slug;
			orderItemResponse.quantity = orderDetail.quantity;

			const image = await imageRepository.findOneBy({
				type: ImageType.RECIPE,
				entityId: orderDetail.mealKit.recipe.id
			});

			if (image) {
				orderItemResponse.image = image.url;
			} else {
				orderItemResponse.image = DEFAULT_IMAGE;
			}

			if (orderDetail.mealKit.extraSpice && orderItemResponse.extraSpice) {
				const image = await imageRepository.findOneBy({
					type: ImageType.EXTRASPICE,
					entityId: orderDetail.mealKit.extraSpice.id
				});

				if (image) {
					orderItemResponse.extraSpice.image = image.url;
				} else {
					orderItemResponse.extraSpice.image = DEFAULT_IMAGE;
				}
			}

			orderItemResponseList.push(orderItemResponse);
		}
		orderDetailResponse.orderItems = orderItemResponseList;

		response.data = orderDetailResponse;
		return response.send();
	}
}

export default new OrderService();
