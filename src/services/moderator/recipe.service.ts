import { _Object } from '@aws-sdk/client-s3';
import { MultipartFile } from '@fastify/multipart';
import { FastifyRequest } from 'fastify';
import envConfig from '~configs/env.config';
import { DEFAULT_IMAGE } from '~constants/default.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import { Recipe } from '~models/entities/recipe.entity';
import { RecipeModeratorResponseModel } from '~models/responses/moderator/recipe.response';
import ResponseModel from '~models/responses/response.model';
import { recipeModeratorQueryGetRequest } from '~models/schemas/moderator/recipe.schemas.model';
import {
	recipeCreateRequestSchema,
	recipeUpdateRequestSchema
} from '~models/schemas/recipe.schemas.model';
import recipeRepository from '~repositories/recipe.repository';
import { FastifyResponse } from '~types/fastify.type';
import mapperUtil from '~utils/mapper.util';
import objectUtil from '~utils/object.util';
import redisUtil from '~utils/redis.util';
import s3Util from '~utils/s3.util';
import stringUtil from '~utils/string.util';
import validateUtil from '~utils/validate.util';

class RecipeModeratorService {
	async getRecipeHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: recipeModeratorQueryGetRequest =
			req.query as recipeModeratorQueryGetRequest;

		const pageSize =
			query.pageSize && query.pageSize <= 50 && query.pageSize > 0
				? query.pageSize
				: 50;

		const pageIndex =
			query.pageIndex && query.pageIndex > 0 ? query.pageIndex : 1;

		const orderBy = query.orderBy ? query.orderBy : OrderBy.ASC;

		let recipeQuery = recipeRepository
			.getRepository()
			.createQueryBuilder('recipe')
			.leftJoinAndSelect('recipe.mealKits', 'mealKit')
			.leftJoinAndSelect('recipe.category', 'category')
			.groupBy('recipe.id')
			.addGroupBy('category.id')
			.addGroupBy('mealKit.id')
			.take(pageSize)
			.skip((pageIndex - 1) * pageSize)
			.select([
				'recipe.id',
				'recipe.name',
				'recipe.slug',
				'recipe.level',
				'recipe.time',
				'recipe.createdAt',
				'category.name',
				'mealKit.id'
			])
			.addSelect('COUNT(mealKit.id)', 'totalMealKit');

		switch (query.sortBy) {
			case SortBy.CATEGORY:
				recipeQuery = recipeQuery.orderBy('category.name', orderBy);
				break;
			case SortBy.LEVEL:
				recipeQuery = recipeQuery.orderBy('recipe.level', orderBy);
				break;
			case SortBy.TIME:
				recipeQuery = recipeQuery.orderBy('recipe.time', orderBy);
				break;
			case SortBy.NAME:
				recipeQuery = recipeQuery.orderBy('recipe.name', orderBy);
				break;
			case SortBy.TOTALMEALKIT:
				recipeQuery = recipeQuery.orderBy('totalMealKit', orderBy);
				break;
			case SortBy.NEWEST:
			default:
				recipeQuery = recipeQuery.orderBy('recipe.createdAt', orderBy);
				break;
		}

		if (query.cookLevel) {
			const cookLevels = query.cookLevel.split(',');
			recipeQuery = recipeQuery.andWhere('recipe.level IN (:...cookLevels)', {
				cookLevels
			});
		}

		if (query.category) {
			const categories = query.category.split(',');
			recipeQuery = recipeQuery.andWhere(
				'recipe.category IN (:...categories)',
				{
					categories
				}
			);
		}

		if (query.searchRecipe) {
			recipeQuery = recipeQuery.andWhere(
				`LOWER(REPLACE(recipe.name, ' ', '')) LIKE LOWER(REPLACE(:searchRecipe, ' ', ''))`,
				{ searchRecipe: '%' + query.searchRecipe + '%' }
			);
		}

		const [recipes, itemTotal] = await recipeQuery.getManyAndCount();

		const pageTotal = Math.ceil(itemTotal / pageSize);

		let images = await redisUtil.getImagesRecipes();
		if (images === null) {
			const datas3 = await s3Util.getImages({
				type: 'recipe'
			});
			req.log.info('Call s3 get images');
			images = datas3.Contents;
			if (images) {
				await redisUtil.setImagesRecipes(images);
			} else {
				images = [];
			}
		}

		recipes.forEach((recipe) => {
			if (!images) {
				return;
			}
			const indexImage = images.findIndex((image: _Object) => {
				return image.Key?.includes(recipe.id);
			});
			if (indexImage != -1) {
				recipe.images.push(envConfig.S3_HOST + images[indexImage].Key);
				images.splice(indexImage, 1);
			}
		});

		const recipeModeratorResponseModelList: Array<RecipeModeratorResponseModel> =
			[];
		recipes.forEach((recipe) => {
			const recipeModeratorResponseModel = new RecipeModeratorResponseModel();
			recipeModeratorResponseModel.id = recipe.id;
			recipeModeratorResponseModel.name = recipe.name;
			recipeModeratorResponseModel.slug = recipe.slug;
			recipeModeratorResponseModel.image = recipe?.images[0] || DEFAULT_IMAGE;
			recipeModeratorResponseModel.level = recipe.level;
			recipeModeratorResponseModel.time = recipe.time;
			recipeModeratorResponseModel.category = recipe.category;
			recipeModeratorResponseModel.totalmealkit = recipe.mealKits.length;
			recipeModeratorResponseModelList.push(recipeModeratorResponseModel);
		});

		const response = new ResponseModel(res);
		response.data = {
			data: recipeModeratorResponseModelList,
			itemTotal,
			pageIndex,
			pageSize,
			pageTotal
		};
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

		mapperUtil.mapObjToEntity(recipe, recipeObj);

		await recipeRepository.update(recipe);

		return response.send();
	}

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

		mapperUtil.mapObjToEntity(newRecipe, recipeObj);

		newRecipe.slug =
			stringUtil
				.removeVietnameseTones(newRecipe.name)
				.toLocaleLowerCase('vi')
				.replaceAll(' ', '-') +
			'.' +
			newRecipe.id;

		await recipeRepository.create(newRecipe);

		for (const file of files) {
			await s3Util.uploadImage({
				data: await file.toBuffer(),
				name: newRecipe.id,
				type: 'recipe'
			});
		}

		await redisUtil.removeImagesRecipes();

		return response.send();
	}
}

export default new RecipeModeratorService();
