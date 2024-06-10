import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import userUtil from '~utils/user.util';
import orderDetailRepository from '~repositories/orderDetail.repository';
import { OrderDetail } from '~models/entities/order-detail.entity';
import mealKitRepository from '~repositories/mealKit.repository';
import {
	CartCreateRequest,
	CartDeleteRequest,
	CartUpdateRequest
} from '~models/schemas/cart.schemas.model';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { In } from 'typeorm';

class CartService {
	async getCartHandle(req: FastifyRequest, res: FastifyResponse) {
		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);

		const carts = await orderDetailRepository.find({
			where: {
				isCart: true,
				customer: {
					id: customer!.id
				}
			},
			relations: ['customer', 'mealKit']
		});
		const response = new ResponseModel(res);
		response.data = carts;
		return response.send();
	}

	async createCartHandle(req: FastifyRequest, res: FastifyResponse) {
		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);
		const { mealkitId, quantity }: CartCreateRequest =
			req.body as CartCreateRequest;

		const mealKit = await mealKitRepository.findOneBy({
			id: mealkitId
		});

		const response = new ResponseModel(res);

		if (!mealKit) {
			response.message = 'Meal Kit not found';
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}

		let cart = await orderDetailRepository.findOne({
			where: {
				isCart: true,
				customer: {
					id: customer!.id
				},
				mealKit: {
					id: mealKit.id
				}
			}
		});

		if (cart) {
			cart.quantity = cart.quantity + quantity;
			await orderDetailRepository.update(cart);
		} else {
			cart = new OrderDetail();
			cart.customer = customer!;
			cart.isCart = true;
			cart.mealKit = mealKit;
			cart.quantity = quantity;
			await orderDetailRepository.create(cart);
		}

		response.data = cart;
		return response.send();
	}

	async updateCartHandle(req: FastifyRequest, res: FastifyResponse) {
		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);
		const { quantity, mealkitId }: CartUpdateRequest =
			req.body as CartUpdateRequest;

		const mealKit = await mealKitRepository.findOneBy({
			id: mealkitId
		});

		const response = new ResponseModel(res);

		if (!mealKit) {
			response.message = 'Meal Kit not found';
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}

		const cart = await orderDetailRepository.findOne({
			where: {
				isCart: true,
				customer: {
					id: customer!.id
				},
				mealKit: {
					id: mealKit.id
				}
			},
			relations: ['mealKit'],
			select: ['id', 'quantity', 'mealKit']
		});

		if (cart) {
			cart.quantity = quantity;
			await orderDetailRepository.update(cart);
			response.data = cart;
		} else {
			response.message = 'MealKit not in cart !';
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
		}

		return response.send();
	}

	async deleteCartHandle(req: FastifyRequest, res: FastifyResponse) {
		const { cartIds }: CartDeleteRequest = req.body as CartDeleteRequest;
		const response = new ResponseModel(res);

		const carts = await orderDetailRepository.findBy({
			id: In(cartIds)
		});

		if (carts.length != 0) {
			await orderDetailRepository.remove(carts);
		} else {
			response.message = 'Cart not found';
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
		}

		return response.send();
	}
}

export default new CartService();
