import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import userUtil from '~utils/user.util';
import orderDetailRepository from '~repositories/orderDetail.repository';
import { CheckoutCreateRequest } from '~models/schemas/checkout.schemas.model';
import { In } from 'typeorm';
import {
	AreaResponse,
	CheckoutResponse,
	ItemResponse,
	ShippingDate
} from '~models/responses/checkout.response.model';
import mapperUtil from '~utils/mapper.util';
import areaRepository from '~repositories/area.repository';
import configRepository from '~repositories/config.repository';
import redisUtil from '~utils/redis.util';
import paymentRepository from '~repositories/payment.repository';
import { DEFAULT_IMAGE } from '~constants/default.constant';
import { ExtraSpiceResponse } from '~models/responses/cart.response.model';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';

class CheckoutService {
	async getCheckoutHandle(req: FastifyRequest, res: FastifyResponse) {
		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);
		const response = new ResponseModel(res);

		const checkout = await redisUtil.getCheckout(customer!);

		response.data = checkout;
		return response.send();
	}

	async createCheckoutHandle(req: FastifyRequest, res: FastifyResponse) {
		const { cartIds }: CheckoutCreateRequest =
			req.body as CheckoutCreateRequest;
		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);
		const response = new ResponseModel(res);

		const carts = await orderDetailRepository.find({
			where: {
				isCart: true,
				customer: {
					id: customer!.id
				},
				id: In(cartIds)
			},
			relations: ['mealKit', 'mealKit.recipe', 'mealKit.extraSpice'],
			select: {
				id: true,
				quantity: true,
				has_extra_spice: true,
				mealKit: {
					serving: true,
					price: true,
					recipe: {
						name: true
					},
					extraSpice: {
						id: true,
						name: true,
						price: true
					}
				}
			}
		});

		if (carts.length == 0) {
			response.message = 'No item can add in checkout';
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			return response.send();
		}

		const items: Array<ItemResponse> = [];
		for (const cart of carts) {
			let extraSpice = null;
			if (cart.has_extra_spice && cart.mealKit.extraSpice) {
				extraSpice = mapperUtil.mapEntityToClass(
					cart.mealKit.extraSpice,
					ExtraSpiceResponse
				);
				extraSpice.image = DEFAULT_IMAGE;
			}

			const itemResponse = mapperUtil.mapEntityToClass(cart, ItemResponse);
			itemResponse.name = cart.mealKit.recipe.name;
			itemResponse.price = cart.mealKit.price;
			itemResponse.serving = cart.mealKit.serving;
			itemResponse.slug =
				cart.mealKit.recipe.name + '.' + cart.mealKit.recipe.id;
			itemResponse.image = DEFAULT_IMAGE;
			itemResponse.extraSpice = extraSpice;
			items.push(itemResponse);
		}

		const area = await areaRepository.findAll();
		const areaResponseList: Array<AreaResponse> = [];
		for (const place of area) {
			const areaResponse = mapperUtil.mapEntityToClass(place, AreaResponse);
			areaResponseList.push(areaResponse);
		}

		const configs = await configRepository.findAll();
		let workEndHour = 0;
		let maxShippingHour = 0;
		configs.forEach((config) => {
			if (config.type == 'workEndHour') {
				workEndHour = config.value;
			} else if (config.type == 'maxShippingHour') {
				maxShippingHour = config.value;
			}
		});
		const currentDate = new Date();
		const instantDate = new ShippingDate();
		const instantCurrentDate = new Date();
		if (workEndHour - currentDate.getHours() <= maxShippingHour) {
			instantCurrentDate.setDate(currentDate.getDate() + 1);
		}
		instantDate.day = instantCurrentDate.getDate();
		instantDate.month = instantCurrentDate.getMonth() + 1;
		instantDate.year = instantCurrentDate.getFullYear();

		const standardCurrentDate = new Date();
		standardCurrentDate.setDate(currentDate.getDate() + 1);
		const standardDate = new ShippingDate();
		standardDate.day = standardCurrentDate.getDate();
		standardDate.month = standardCurrentDate.getMonth() + 1;
		standardDate.year = standardCurrentDate.getFullYear();

		const payments = await paymentRepository.findAll();

		const checkoutResponse = new CheckoutResponse();
		checkoutResponse.items = items;
		checkoutResponse.area = areaResponseList;
		checkoutResponse.instantDate = instantDate;
		checkoutResponse.standardDate = standardDate;
		checkoutResponse.payments = payments;

		await redisUtil.setCheckout(customer!, checkoutResponse);

		return response.send();
	}
}

export default new CheckoutService();
