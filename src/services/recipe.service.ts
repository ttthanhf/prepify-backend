import { MultipartFile } from '@fastify/multipart';
import envConfig from '~configs/env.config';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import { Recipe } from '~models/entities/recipe.entity';
import ResponseModel from '~models/responses/response.model';
import {
	RecipeGetRequest,
	recipeCreateRequestSchema,
	recipeUpdateRequestSchema
} from '~models/schemas/recipe.schemas.model';
import recipeRepository from '~repositories/recipe.repository';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import objectUtil from '~utils/object.util';

import s3Util from '~utils/s3.util';
import stringUtil from '~utils/string.util';
import validateUtil from '~utils/validate.util';

class RecipeService {
	async createRecipeHandle(req: FastifyRequest, res: FastifyResponse) {
		const recipeObj = {} as Recipe;
		const files: Array<MultipartFile> = [];
		const response = new ResponseModel(res);

		for await (const part of req.parts()) {
			if (part.type == 'field') {
				objectUtil.setProperty(
					recipeObj,
					part.fieldname as keyof Recipe,
					stringUtil.tryParseStringToJSON(String(part.value))
				);
			} else if (part.type == 'file') {
				if (part.fieldname == 'images') {
					if (part.mimetype.startsWith('image/')) {
						files.push(part);
					} else {
						response.message = 'Images have some file not image';
						response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
						return response.send();
					}
				}
			}
		}

		const newRecipe = new Recipe();

		validateUtil.validate(res, recipeCreateRequestSchema, recipeObj);

		objectUtil.mapObjToEntity(newRecipe, recipeObj);

		await recipeRepository.create(newRecipe);

		for (const file of files) {
			await s3Util.uploadImage({
				data: await file.toBuffer(),
				name: newRecipe.id,
				type: 'recipe'
			});
		}

		return response.send();
	}

	async updateRecipeHandle(req: FastifyRequest, res: FastifyResponse) {
		const { recipe_id }: any = req.params as Object;
		const recipeObj = {} as Recipe;

		const recipe = await recipeRepository.findOneBy({
			id: recipe_id
		});

		const response = new ResponseModel(res);
		if (!recipe) {
			response.message = 'Recipe not found';
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			return response.send();
		}

		for await (const part of req.parts()) {
			if (part.type == 'field') {
				objectUtil.setProperty(
					recipeObj,
					part.fieldname as keyof Recipe,
					stringUtil.tryParseStringToJSON(String(part.value))
				);
			}
		}

		validateUtil.validate(res, recipeUpdateRequestSchema, recipeObj);

		objectUtil.mapObjToEntity(recipe, recipeObj);

		await recipeRepository.update(recipe);

		return response.send();
	}

	async getRecipeHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: RecipeGetRequest = req.query as RecipeGetRequest;

		const pageSize =
			query.pageSize && query.pageSize <= 9 && query.pageSize > 0
				? query.pageSize
				: 9;

		const pageIndex =
			query.pageIndex && query.pageIndex > 0 ? query.pageIndex : 1;

		const orderBy = query.orderBy ? query.orderBy : OrderBy.ASC;
		const sortBy = query.sortBy ? query.sortBy : SortBy.NEWEST;

		const minPrice = query.minPrice && query.minPrice >= 0 ? query.minPrice : 0;
		const maxPrice =
			query.maxPrice && query.maxPrice >= 0 ? query.maxPrice : 10000000;

		const minRating =
			query.minRating && query.minRating >= 0 && query.minRating <= 5
				? query.minRating
				: 0;
		const maxRating =
			query.maxRating && query.maxRating >= 0 && query.maxRating <= 5
				? query.maxRating
				: 5;

		let recipes: Recipe[];
		let recipeQuery = recipeRepository
			.getRepository()
			.createQueryBuilder('recipe')
			.leftJoinAndSelect('recipe.mealKits', 'mealKit')
			.leftJoinAndSelect('mealKit.orderDetails', 'orderDetail')
			.leftJoinAndSelect('recipe.foodStyles', 'foodStyle')
			.groupBy('recipe.id')
			.addGroupBy('mealKit.id')
			.addGroupBy('orderDetail.id')
			.addGroupBy('foodStyle.id')
			.take(pageSize)
			.skip((pageIndex - 1) * pageSize);

		if (sortBy === SortBy.POPULAR) {
			recipeQuery = recipeQuery
				.addSelect('COUNT(orderDetail.id)', 'orderDetailCount')
				.orderBy('orderDetailCount', orderBy);
		} else if (sortBy === SortBy.PRICE) {
			recipeQuery = recipeQuery.orderBy('mealKit.price', orderBy);
		} else if (sortBy === SortBy.NEWEST) {
			recipeQuery = recipeQuery.orderBy('recipe.createdAt', orderBy);
		}

		if (query.foodStyle) {
			const foodStyleSlugs = query.foodStyle.split(',');
			for (const foodStyleSlug of foodStyleSlugs) {
				recipeQuery = recipeQuery.andWhere(
					`foodStyle.slug LIKE :foodStyleSlug`,
					{
						foodStyleSlug
					}
				);
			}
		}

		if (query.minPrice || query.maxPrice) {
			recipeQuery = recipeQuery.andWhere(
				'mealKit.price BETWEEN :minPrice AND :maxPrice',
				{
					minPrice,
					maxPrice
				}
			);
		}

		if (query.minRating || query.maxRating) {
			recipeQuery = recipeQuery.andWhere(
				'mealKit.rating BETWEEN :minRating AND :maxRating',
				{
					minRating,
					maxRating
				}
			);
		}

		if (query.searchRecipe) {
			recipeQuery = recipeQuery.andWhere(
				`LOWER(REPLACE(recipe.name, ' ', '')) LIKE LOWER(REPLACE(:searchRecipe, ' ', ''))`,
				{ searchRecipe: '%' + query.searchRecipe + '%' }
			);
		}

		recipes = await recipeQuery.getMany();

		const itemTotal = recipes.length;
		const pageTotal = Math.ceil(itemTotal / pageSize);

		const datas3 = await s3Util.getImages({
			type: 'recipe'
		});

		const images = datas3.Contents || [];
		recipes.forEach((recipe) => {
			if (images.length == 0) {
				return;
			}
			const indexImage = images.findIndex((image) => {
				return image.Key?.includes(recipe.id);
			});
			if (indexImage != -1) {
				recipe.images.push(envConfig.S3_HOST + images[indexImage].Key);
				images.splice(indexImage, 1);
			}
		});

		const response = new ResponseModel(res);
		response.data = {
			recipes,
			itemTotal,
			pageIndex,
			pageSize,
			pageTotal
		};
		return response.send();
	}
}

export default new RecipeService();
