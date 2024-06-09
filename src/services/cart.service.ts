import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import userUtil from '~utils/user.util';
import orderDetailRepository from '~repositories/orderDetail.repository';
import { OrderDetail } from '~models/entities/order-detail.entity';
import mealKitRepository from '~repositories/mealKit.repository';
import { CartCreateRequest } from '~models/schemas/cart.schemas.model';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';

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
}

export default new CartService();
