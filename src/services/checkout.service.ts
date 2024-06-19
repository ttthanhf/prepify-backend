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
			relations: ['mealKit', 'mealKit.recipe'],
			select: {
				id: true,
				quantity: true,
				mealKit: {
					serving: true,
					price: true,
					recipe: {
						name: true
					}
				}
			}
		});

		const items: Array<ItemResponse> = [];
		for (const cart of carts) {
			const itemResponse = mapperUtil.mapEntityToClass(cart, ItemResponse);
			itemResponse.name = cart.mealKit.recipe.name;
			itemResponse.price = cart.mealKit.price;
			itemResponse.serving = cart.mealKit.serving;
			items.push(itemResponse);
		}

		const area = await areaRepository.findAll();
		const areaResponseList: Array<AreaResponse> = [];
		for (const place of area) {
			const areaResponse = mapperUtil.mapEntityToClass(place, AreaResponse);
			areaResponseList.push(areaResponse);
		}

		const currentDate = new Date();
		const config = await configRepository.find({
			select: {
				workEndHour: true,
				maxShippingHour: true
			}
		});

		const instantDate = new ShippingDate();
		const instantCurrentDate = new Date();
		if (
			config[0].workEndHour - currentDate.getHours() <=
			config[0].maxShippingHour
		) {
			instantCurrentDate.setDate(currentDate.getDate() + 1);
		}
		instantDate.day = instantCurrentDate.getDate();
		instantDate.month = instantCurrentDate.getMonth();
		instantDate.year = instantCurrentDate.getFullYear();

		const standardCurrentDate = new Date();
		standardCurrentDate.setDate(currentDate.getDate() + 1);
		const standardDate = new ShippingDate();
		standardDate.day = standardCurrentDate.getDate();
		standardDate.month = standardCurrentDate.getMonth();
		standardDate.year = standardCurrentDate.getFullYear();

		const checkoutResponse = new CheckoutResponse();
		checkoutResponse.items = items;
		checkoutResponse.area = areaResponseList;
		checkoutResponse.instantDate = instantDate;
		checkoutResponse.standardDate = standardDate;

		await redisUtil.setCheckout(customer!, checkoutResponse);

		return response.send();
	}
}

export default new CheckoutService();
