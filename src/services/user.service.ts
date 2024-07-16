import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import jwtUtil from '~utils/jwt.util';
import userRepository from '~repositories/user.repository';
import headerUtil from '~utils/header.util';
import objectUtil from '~utils/object.util';
import imageRepository from '~repositories/image.repository';
import { ImageType } from '~constants/image.constant';
import userUtil from '~utils/user.util';
import { UserUpdateRequest } from '~models/schemas/user.schemas.model';
import { Area } from '~models/entities/area.entity';
import customerRepository from '~repositories/customer.repository';
import { RestrictIngredient } from '~models/entities/restrict-ingredient.entity';
import ingredientRepository from '~repositories/ingredient.repository';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import restrictIngredientRepository from '~repositories/restrictIngredient.repository';
import { In } from 'typeorm';

class AuthService {
	async getCurrentUser(req: FastifyRequest, res: FastifyResponse) {
		const token = headerUtil.extractAuthorization(req.headers);
		const userId = jwtUtil.verify(token).userId;
		const user = await userRepository.findOne({
			where: {
				id: userId
			},
			relations: [
				'area',
				'customer',
				'customer.restrictIngredients',
				'customer.restrictIngredients.ingredient'
			]
		});

		const response = new ResponseModel(res);
		const userResponse = objectUtil.hideProperties(user!, 'password', 'area');
		userResponse.hasPassword = user?.password ? true : false;
		Object.assign(userResponse, { areaId: user!.area?.id });

		const image = await imageRepository.findOneBy({
			type: ImageType.USER,
			entityId: userId
		});
		if (image) {
			userResponse.image = image.url;
		}

		response.data = {
			user: userResponse
		};
		return response.send();
	}

	async updateUser(req: FastifyRequest, res: FastifyResponse) {
		const user = await userUtil.getUserByTokenInHeader(req.headers);
		const query: UserUpdateRequest = req.body as UserUpdateRequest;
		const response = new ResponseModel(res);

		user!.fullname = query.fullname;
		user!.email = query.email;
		user!.phone = query.phone;
		user!.area = {
			id: query.areaId
		} as Area;
		user!.address = query.address;

		const customer = await customerRepository.findOne({
			where: {
				user: {
					id: user!.id
				}
			},
			relations: ['user', 'restrictIngredients']
		});

		if (query.createIngredientIds) {
			query.createIngredientIds.forEach(async (id: any) => {
				const restrictIngredient = new RestrictIngredient();
				restrictIngredient.customer = customer!;
				const ingredient = await ingredientRepository.findOneBy({
					id
				});
				if (ingredient) {
					restrictIngredient.ingredient = ingredient;
					await restrictIngredientRepository.create(restrictIngredient);
				} else {
					response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
					response.message = 'Some ingredient id not found';
					return response.send();
				}
			});
		}

		if (query.removeIngredientIds) {
			const restrictIngredients = await restrictIngredientRepository.find({
				where: {
					ingredient: {
						id: In(query.removeIngredientIds)
					},
					customer: {
						id: customer!.id
					}
				},
				relations: ['customer', 'ingredient']
			});

			if (restrictIngredients.length) {
				await restrictIngredientRepository.remove(restrictIngredients);
			}
		}

		await userRepository.update(user!);

		return response.send();
	}
}

export default new AuthService();
