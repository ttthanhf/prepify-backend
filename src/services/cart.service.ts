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
import {
	CartItemResponse,
	MealKitCartResponse,
	RecipeCartResponse
} from '~models/responses/cart.response.model';
import mapperUtil from '~utils/mapper.util';
import { DEFAULT_IMAGE } from '~constants/default.constant';
import { ImageType } from '~constants/image.constant';
import imageRepository from '~repositories/image.repository';

class CartService {
	async getCartHandle(req: FastifyRequest, res: FastifyResponse) {
		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);
		const response = new ResponseModel(res);

		const carts = await orderDetailRepository
			.getRepository()
			.createQueryBuilder('orderDetail')
			.innerJoinAndSelect('orderDetail.mealKit', 'mealKit')
			.innerJoinAndSelect('mealKit.recipe', 'recipe')
			.innerJoinAndSelect('mealKit.extraSpice', 'extraSpice')
			.where('orderDetail.isCart = :isCart', { isCart: true })
			.andWhere('orderDetail.customer.id = :customerId', {
				customerId: customer!.id
			})
			.andWhere('mealKit.status = :mealKitStatus', { mealKitStatus: true })
			.select([
				'orderDetail.id',
				'orderDetail.has_extra_spice',
				'orderDetail.quantity',
				'mealKit.id',
				'mealKit.price',
				'mealKit.serving',
				'recipe.id',
				'recipe.name',
				'recipe.slug',
				'extraSpice.id',
				'extraSpice.name',
				'extraSpice.price'
			])
			.getMany();

		const CartList: Array<CartItemResponse> = [];
		const mealKitItemExisted: { [key: string]: any } = {};

		for (const cart of carts) {
			if (!cart.has_extra_spice) {
				cart.mealKit.extraSpice = null;
			}

			const recipeCart = mapperUtil.mapEntityToClass(
				cart.mealKit.recipe,
				RecipeCartResponse
			);

			const mealKitCart = mapperUtil.mapEntityToClass(
				cart.mealKit,
				MealKitCartResponse
			);

			if (cart.mealKit.extraSpice && cart.has_extra_spice) {
				mealKitCart.extraSpice.image = DEFAULT_IMAGE;
			}

			const mealKitItemList: Array<MealKitCartResponse> = [];
			if (!mealKitItemExisted[cart.mealKit.recipe.id]) {
				const mealKits = await mealKitRepository.find({
					where: {
						recipe: {
							id: cart.mealKit.recipe.id
						}
					},
					relations: ['extraSpice'],
					select: {
						id: true,
						serving: true,
						price: true,
						extraSpice: {
							id: true,
							name: true,
							price: true
						}
					}
				});
				for (const mealKit of mealKits) {
					const mealKitCartResponse = mapperUtil.mapEntityToClass(
						mealKit,
						MealKitCartResponse
					);
					mealKitItemList.push(mealKitCartResponse);
				}
				for (const mealKitItem of mealKitItemList) {
					if (mealKitItem.extraSpice) {
						mealKitItem.extraSpice.image = DEFAULT_IMAGE;
					}
				}
				mealKitItemExisted[cart.mealKit.recipe.id] = mealKitItemList;
			}

			const mealKitItems = mealKitItemExisted[cart.mealKit.recipe.id];

			const cartItem = mapperUtil.mapEntityToClass(cart, CartItemResponse);
			cartItem.recipe = recipeCart;
			cartItem.mealKitSelected = mealKitCart;
			cartItem.mealKits = mealKitItems;

			const images = await imageRepository.findBy({
				type: ImageType.RECIPE,
				entityId: cartItem.recipe.id
			});

			if (images[0]) {
				cartItem.image = images[0].url;
			} else {
				cartItem.image = DEFAULT_IMAGE;
			}

			CartList.push(cartItem);
		}
		response.data = CartList;
		return response.send();
	}

	async getCartLengthHandle(req: FastifyRequest, res: FastifyResponse) {
		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);
		const length = await orderDetailRepository.count({
			where: {
				customer: {
					id: customer!.id
				},
				isCart: true
			}
		});

		const response = new ResponseModel(res);
		response.data = {
			length
		};
		return response.send();
	}

	async createCartHandle(req: FastifyRequest, res: FastifyResponse) {
		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);
		const { mealkitId, quantity, has_extra_spice }: CartCreateRequest =
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
			if (!cart.has_extra_spice && has_extra_spice) {
				cart.has_extra_spice = has_extra_spice;
			}
			if (
				cart.quantity > 99 ||
				cart.quantity < 1 ||
				quantity < 1 ||
				quantity > 99
			) {
				response.message = 'Quantity not lower 1 or higher 99 item';
				response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
				return response.send();
			}
			await orderDetailRepository.update(cart);
		} else {
			cart = new OrderDetail();
			cart.customer = customer!;
			cart.isCart = true;
			cart.mealKit = mealKit;
			cart.quantity = quantity;
			cart.has_extra_spice = has_extra_spice;
			await orderDetailRepository.create(cart);
		}

		response.data = cart;
		return response.send();
	}

	async updateCartHandle(req: FastifyRequest, res: FastifyResponse) {
		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);
		const { quantity, mealkitId, cartId, has_extra_spice }: CartUpdateRequest =
			req.body as CartUpdateRequest;

		const response = new ResponseModel(res);

		if (quantity < 1 || quantity > 99) {
			response.message = 'Quantity not lower 1 or higher 99 item';
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			return response.send();
		}

		const cart = await orderDetailRepository.findOne({
			where: {
				isCart: true,
				id: cartId,
				customer: {
					id: customer!.id
				}
			},
			relations: ['mealKit'],
			select: ['id', 'quantity', 'mealKit']
		});

		if (cart) {
			const mealKit = await mealKitRepository.findOneBy({
				id: mealkitId
			});

			if (!mealKit) {
				response.message = 'Meal Kit not found';
				response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
				return response.send();
			}
			cart.mealKit.id = mealKit.id;
			cart.quantity = quantity;
			cart.has_extra_spice = has_extra_spice;
			await orderDetailRepository.update(cart);
		} else {
			response.message = 'MealKit not in cart !';
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
		}

		return response.send();
	}

	async deleteCartHandle(req: FastifyRequest, res: FastifyResponse) {
		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);
		const { cartIds }: CartDeleteRequest = req.body as CartDeleteRequest;
		const response = new ResponseModel(res);

		const carts = await orderDetailRepository.findBy({
			id: In(cartIds),
			customer: {
				id: customer!.id
			}
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
