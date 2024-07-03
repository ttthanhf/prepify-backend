import { FastifyRequest } from 'fastify';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import { FoodStyle } from '~models/entities/food-style.entity';
import { FoodStyleModeratorGetResponse } from '~models/responses/moderator/foodStyle.response';
import ResponseModel from '~models/responses/response.model';
import {
	FoodStyleModeratorQueryCreateRequest,
	FoodStyleModeratorQueryGetRequest
} from '~models/schemas/moderator/foodStyle.schemas.model';
import foodStyleRepository from '~repositories/foodStyle.repository';
import { FastifyResponse } from '~types/fastify.type';
import mapperUtil from '~utils/mapper.util';
import stringUtil from '~utils/string.util';

class FoodStyleModeratorService {
	async getAllFoodStyleHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: FoodStyleModeratorQueryGetRequest =
			req.query as FoodStyleModeratorQueryGetRequest;

		const pageSize =
			query.pageSize && query.pageSize <= 50 && query.pageSize > 0
				? query.pageSize
				: 50;

		const pageIndex =
			query.pageIndex && query.pageIndex > 0 ? query.pageIndex : 1;

		const orderBy = query.orderBy ? query.orderBy : OrderBy.ASC;

		let foodStyleQuery = foodStyleRepository
			.getRepository()
			.createQueryBuilder('food_style')
			.leftJoinAndSelect('food_style.recipes', 'recipes')
			.groupBy('food_style.id')
			.addGroupBy('recipes.id')
			.take(pageSize)
			.skip((pageIndex - 1) * pageSize);

		switch (query.sortBy) {
			case SortBy.NAME:
				foodStyleQuery = foodStyleQuery.orderBy('food_style.name', orderBy);
				break;
			case SortBy.TITLE:
				foodStyleQuery = foodStyleQuery.orderBy('food_style.title', orderBy);
				break;
		}

		if (query.type) {
			const types = query.type.split(',');
			foodStyleQuery = foodStyleQuery.andWhere(
				'food_style.type IN (:...types)',
				{
					types
				}
			);
		}

		if (query.search) {
			foodStyleQuery = foodStyleQuery.andWhere(
				`LOWER(REPLACE(food_style.name, ' ', '')) LIKE LOWER(REPLACE(:search, ' ', ''))`,
				{ search: '%' + query.search + '%' }
			);
		}

		const [foodStyles, itemTotal] = await foodStyleQuery.getManyAndCount();

		const pageTotal = Math.ceil(itemTotal / pageSize);

		const foodStyleModeratorGetResponseList: Array<FoodStyleModeratorGetResponse> =
			[];

		foodStyles.forEach((item) => {
			const foodStyleModeratorGetResponse = mapperUtil.mapEntityToClass(
				item,
				FoodStyleModeratorGetResponse
			);
			foodStyleModeratorGetResponse.totalRecipes = item.recipes.length;
			foodStyleModeratorGetResponseList.push(foodStyleModeratorGetResponse);
		});

		const response = new ResponseModel(res);
		response.data = {
			data: foodStyleModeratorGetResponseList,
			itemTotal,
			pageTotal,
			pageIndex,
			pageSize
		};
		return response.send();
	}

	async createFoodStyleHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: FoodStyleModeratorQueryCreateRequest =
			req.body as FoodStyleModeratorQueryCreateRequest;
		const response = new ResponseModel(res);
		const foodStyle = new FoodStyle();
		foodStyle.name = query.name;
		foodStyle.title = query.title;
		foodStyle.type = stringUtil
			.removeVietnameseTones(query.title)
			.replaceAll(' ', '-')
			.toLowerCase();
		foodStyle.slug = stringUtil
			.removeVietnameseTones(query.name)
			.replaceAll(' ', '-')
			.toLowerCase();

		const isError = await foodStyleRepository.findOneBy({
			slug: foodStyle.slug,
			type: foodStyle.type
		});
		if (isError) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Same title and name with exist item';
			return response.send();
		}

		await foodStyleRepository.create(foodStyle);

		return response.send();
	}

	async updateFoodStyleHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: FoodStyleModeratorQueryCreateRequest =
			req.body as FoodStyleModeratorQueryCreateRequest;

		const { id }: any = req.params as any;

		const foodStyle = await foodStyleRepository.findOneBy({
			id
		});

		const response = new ResponseModel(res);
		if (!foodStyle) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			response.message = 'Item not found';
			return response.send();
		}

		foodStyle.name = query.name;
		foodStyle.title = query.title;
		foodStyle.type = stringUtil
			.removeVietnameseTones(query.title)
			.replaceAll(' ', '-');
		foodStyle.slug = stringUtil
			.removeVietnameseTones(query.name)
			.replaceAll(' ', '-');

		const isError = await foodStyleRepository.findOneBy({
			slug: foodStyle.slug,
			type: foodStyle.type
		});
		if (isError) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Same title and name with exist item';
			return response.send();
		}

		await foodStyleRepository.update(foodStyle);
		return response.send();
	}

	async deleteFoodStyleHandle(req: FastifyRequest, res: FastifyResponse) {
		const { id }: any = req.params as any;

		const foodStyle = await foodStyleRepository.findOne({
			where: {
				id
			},
			relations: ['recipes']
		});

		const response = new ResponseModel(res);
		if (!foodStyle) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			response.message = 'Item not found';
			return response.send();
		}

		if (foodStyle.recipes && foodStyle.recipes.length != 0) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Food style exist in some recipe';
			return response.send();
		}

		await foodStyleRepository.remove([foodStyle]);
		return response.send();
	}
}

export default new FoodStyleModeratorService();
