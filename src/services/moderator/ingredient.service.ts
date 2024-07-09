import { FastifyRequest } from 'fastify';
import { DEFAULT_IMAGE } from '~constants/default.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { ImageType } from '~constants/image.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import { UnitType } from '~constants/unittype.constant';
import { Image } from '~models/entities/image.entity';
import { Ingredient } from '~models/entities/ingredient.entity';
import { IngredientModeratorGetResponse } from '~models/responses/moderator/ingredient.response';
import ResponseModel from '~models/responses/response.model';
import {
	IngredientModeratorCreateRequest,
	IngredientModeratorQueryGetRequest
} from '~models/schemas/moderator/ingredient.schemas.model';
import imageRepository from '~repositories/image.repository';
import ingredientRepository from '~repositories/ingredient.repository';
import unitRepository from '~repositories/unit.repository';
import { FastifyResponse } from '~types/fastify.type';
import mapperUtil from '~utils/mapper.util';

class IngredientModeratorService {
	async getAllIngredientHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: IngredientModeratorQueryGetRequest =
			req.query as IngredientModeratorQueryGetRequest;

		const pageSize =
			query.pageSize && query.pageSize <= 100 && query.pageSize > 0
				? query.pageSize
				: 10;

		const pageIndex =
			query.pageIndex && query.pageIndex > 0 ? query.pageIndex : 1;

		const orderBy = query.orderBy ? query.orderBy : OrderBy.ASC;

		let ingredientQuery = ingredientRepository
			.getRepository()
			.createQueryBuilder('ingredient')
			.leftJoinAndSelect('ingredient.unit', 'unit')
			.groupBy('ingredient.id')
			.addGroupBy('unit.id')
			.take(pageSize)
			.skip((pageIndex - 1) * pageSize);

		switch (query.sortBy) {
			case SortBy.NAME:
				ingredientQuery = ingredientQuery.orderBy('ingredient.name', orderBy);
				break;
			case SortBy.PRICE:
				ingredientQuery = ingredientQuery.orderBy('ingredient.price', orderBy);
				break;
			case SortBy.UNIT:
				ingredientQuery = ingredientQuery.orderBy('unit.name', orderBy);
				break;
			case SortBy.CATEGORY:
				ingredientQuery = ingredientQuery.orderBy(
					'ingredient.category',
					orderBy
				);
				break;
		}

		if (query.search) {
			ingredientQuery = ingredientQuery.andWhere(
				`LOWER(REPLACE(ingredient.name, ' ', '')) LIKE LOWER(REPLACE(:search, ' ', ''))`,
				{
					search: `%${query.search}%`
				}
			);
		}

		const [ingredients, itemTotal] = await ingredientQuery.getManyAndCount();

		const pageTotal = Math.ceil(itemTotal / pageSize);

		const ingredientModeratorGetResponseList: Array<IngredientModeratorGetResponse> =
			[];

		for (const item of ingredients) {
			const ingredientModeratorGetResponse = mapperUtil.mapEntityToClass(
				item,
				IngredientModeratorGetResponse
			);
			ingredientModeratorGetResponse.unit = item.unit.name;

			const images = await imageRepository.findBy({
				type: ImageType.INGREDIENT,
				entityId: item.id
			});

			if (images[0]) {
				ingredientModeratorGetResponse.image = images[0].url;
			} else {
				ingredientModeratorGetResponse.image = DEFAULT_IMAGE;
			}

			ingredientModeratorGetResponseList.push(ingredientModeratorGetResponse);
		}

		const response = new ResponseModel(res);
		response.data = {
			data: ingredientModeratorGetResponseList,
			itemTotal,
			pageTotal,
			pageIndex,
			pageSize
		};
		return response.send();
	}

	async getIngredientHandle(req: FastifyRequest, res: FastifyResponse) {
		const { id }: any = req.params;
		const response = new ResponseModel(res);
		const ingredient = await ingredientRepository.findOne({
			where: {
				id
			},
			relations: ['unit']
		});
		if (!ingredient) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}

		const images = await imageRepository.findBy({
			type: ImageType.RECIPE,
			entityId: ingredient.id
		});

		ingredient.image = images[0] ? images[0].url : DEFAULT_IMAGE;

		response.data = ingredient;
		return response.send();
	}

	async createIngredientHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: IngredientModeratorCreateRequest =
			req.body as IngredientModeratorCreateRequest;

		const response = new ResponseModel(res);

		const ingredient = new Ingredient();
		ingredient.name = query.name;
		ingredient.price = query.price;
		ingredient.category = query.category;
		ingredient.updatedAt = new Date();

		const unit = await unitRepository.findOneBy({
			id: query.unit,
			type: UnitType.INGREDIENT
		});
		if (!unit) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Unit not found';
			return response.send();
		}
		ingredient.unit = unit;

		await ingredientRepository.create(ingredient);

		const image = new Image();
		image.type = ImageType.INGREDIENT;
		image.url = query.imageURL;
		image.entityId = ingredient.id;
		await imageRepository.create(image);

		return response.send();
	}

	async updateIngredientHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: IngredientModeratorCreateRequest =
			req.body as IngredientModeratorCreateRequest;
		const { id }: any = req.params;
		const response = new ResponseModel(res);
		const ingredient = await ingredientRepository.findOne({
			where: {
				id
			},
			relations: ['unit']
		});
		if (!ingredient) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}

		ingredient.name = query.name;
		ingredient.price = query.price;
		ingredient.category = query.category;
		ingredient.updatedAt = new Date();

		const unit = await unitRepository.findOneBy({
			id: query.unit,
			type: UnitType.INGREDIENT
		});
		if (!unit) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Unit not found';
			return response.send();
		}
		ingredient.unit = unit;

		await ingredientRepository.update(ingredient);

		let image = await imageRepository.findOneBy({
			entityId: ingredient.id,
			type: ImageType.INGREDIENT
		});

		if (image) {
			image.url = query.imageURL;
		} else {
			image = new Image();
			image.type = ImageType.INGREDIENT;
			image.url = query.imageURL;
			image.entityId = ingredient.id;
		}
		await imageRepository.update(image);

		return response.send();
	}
}

export default new IngredientModeratorService();
