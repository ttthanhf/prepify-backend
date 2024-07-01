import { _Object } from '@aws-sdk/client-s3';
import { MultipartFile } from '@fastify/multipart';
import { FastifyRequest } from 'fastify';
import { In } from 'typeorm';
import envConfig from '~configs/env.config';
import { DEFAULT_IMAGE } from '~constants/default.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import { Ingredient } from '~models/entities/ingredient.entity';
import { Nutrition } from '~models/entities/nutrition.entity';
import { RecipeIngredient } from '~models/entities/recipe-ingredient.entity';
import { RecipeNutrition } from '~models/entities/recipe-nutrition.entity';
import { Recipe } from '~models/entities/recipe.entity';
import { Unit } from '~models/entities/unit.entity';
import {
	AllRecipeModeratorResponseModel,
	IngredientRecipeModeratorResponseModel,
	NutritionRecipeModeratorResponseModel,
	RecipeModeratorResponseModel
} from '~models/responses/moderator/recipe.response';
import ResponseModel from '~models/responses/response.model';
import { recipeModeratorQueryGetRequest } from '~models/schemas/moderator/recipe.schemas.model';
import {
	recipeCreateRequestSchema,
	recipeUpdateRequestSchema
} from '~models/schemas/recipe.schemas.model';
import foodStyleRepository from '~repositories/foodStyle.repository';
import recipeRepository from '~repositories/recipe.repository';
import { FastifyResponse } from '~types/fastify.type';
import mapperUtil from '~utils/mapper.util';
import objectUtil from '~utils/object.util';
import redisUtil from '~utils/redis.util';
import s3Util from '~utils/s3.util';
import stringUtil from '~utils/string.util';
import validateUtil from '~utils/validate.util';

class RecipeModeratorService {
	async getAllRecipeHandle(req: FastifyRequest, res: FastifyResponse) {
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

		const recipeModeratorResponseModelList: Array<AllRecipeModeratorResponseModel> =
			[];
		recipes.forEach((recipe) => {
			const recipeModeratorResponseModel =
				new AllRecipeModeratorResponseModel();
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

	async getRecipeHandle(req: FastifyRequest, res: FastifyResponse) {
		const { recipe_id }: any = req.params as Object;
		const recipe = await recipeRepository.findOne({
			where: {
				id: recipe_id
			},
			relations: [
				'recipeIngredients',
				'recipeIngredients.ingredient',
				'recipeIngredients.unit',
				'recipeNutritions',
				'recipeNutritions.nutrition',
				'recipeNutritions.unit',
				'category',
				'foodStyles'
			]
		});

		const response = new ResponseModel(res);
		if (!recipe) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			response.message = 'Recipe not found';
			return response.send();
		}

		const ingredientRecipeModeratorResponseModelList: Array<IngredientRecipeModeratorResponseModel> =
			recipe.recipeIngredients.map((item) => ({
				ingredient_id: item.ingredient.id,
				unit_id: item.unit.id,
				amount: item.amount
			}));

		const nutritionRecipeModeratorResponseModelList: Array<NutritionRecipeModeratorResponseModel> =
			recipe.recipeNutritions.map((item) => ({
				nutrition_id: item.nutrition.id,
				amount: item.amount,
				unit_id: item.unit.id
			}));

		const foodStylesRecipeModeratorResponseModelList = recipe.foodStyles.reduce(
			(acc, item) => {
				acc[item.type] = item.id;
				return acc;
			},
			{} as Record<string, string>
		);

		const recipeModeratorResponseModel = mapperUtil.mapEntityToClass(
			recipe,
			RecipeModeratorResponseModel
		);
		recipeModeratorResponseModel.category = recipe.category.id;
		recipeModeratorResponseModel.ingredients =
			ingredientRecipeModeratorResponseModelList;
		recipeModeratorResponseModel.nutrition =
			nutritionRecipeModeratorResponseModelList;
		recipeModeratorResponseModel.foodStyles =
			foodStylesRecipeModeratorResponseModelList;

		response.data = recipeModeratorResponseModel;
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

		let foodStylesRequest = [];
		let nutritionsRequest = [];
		let ingredientsRequest = [];

		for await (const part of req.parts()) {
			if (part.type == 'field') {
				objectUtil.setProperty(
					recipeObj,
					part.fieldname as keyof Recipe,
					stringUtil.tryParseStringToJSON(String(part.value))
				);

				switch (part.fieldname) {
					case 'foodStyles':
						foodStylesRequest = await JSON.parse(part.value as any);
						break;
					case 'nutrition':
						nutritionsRequest = await JSON.parse(part.value as any);
						break;
					case 'ingredients':
						ingredientsRequest = await JSON.parse(part.value as any);
						break;
				}
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

		const foodStyles = await foodStyleRepository.findBy({
			id: In(foodStylesRequest)
		});
		newRecipe.foodStyles = foodStyles;

		newRecipe.recipeNutritions = nutritionsRequest.map((item: any) => {
			const recipeNutrition = new RecipeNutrition();
			recipeNutrition.amount = item.amount;
			recipeNutrition.nutrition = { id: item.nutrition_id } as Nutrition;
			recipeNutrition.unit = { id: item.unit_id } as Unit;
			return recipeNutrition;
		});

		newRecipe.recipeIngredients = ingredientsRequest.map((item: any) => {
			const recipeIngredient = new RecipeIngredient();
			recipeIngredient.amount = item.amount;
			recipeIngredient.ingredient = { id: item.ingredient_id } as Ingredient;
			recipeIngredient.unit = { id: item.unit_id } as Unit;
			return recipeIngredient;
		});

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
