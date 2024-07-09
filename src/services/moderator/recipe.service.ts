import { _Object } from '@aws-sdk/client-s3';
import { MultipartFile } from '@fastify/multipart';
import { FastifyRequest } from 'fastify';
import { In } from 'typeorm';
import { DEFAULT_IMAGE } from '~constants/default.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { ImageType } from '~constants/image.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import { ExtraSpice } from '~models/entities/extra-spice.entity';
import { Ingredient } from '~models/entities/ingredient.entity';
import { MealKit } from '~models/entities/meal-kit.entity';
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
import {
	IngredientRecipeUpdateRequestSchema,
	MealkitsRecipeUpdateRequestSchema,
	NutritionRecipeUpdateRequestSchema,
	recipeModeratorQueryGetRequest,
	RecipeUpdateRequest
} from '~models/schemas/moderator/recipe.schemas.model';
import { recipeCreateRequestSchema } from '~models/schemas/moderator/recipe.schemas.model';
import extraSpiceRepository from '~repositories/extraSpice.repository';
import foodStyleRepository from '~repositories/foodStyle.repository';
import imageRepository from '~repositories/image.repository';
import mealKitRepository from '~repositories/mealKit.repository';
import orderDetailRepository from '~repositories/orderDetail.repository';
import recipeIngredientRepository from '~repositories/recipe-ingredient.repository';
import recipeNutritionRepository from '~repositories/recipe-nutrition.repository';
import recipeRepository from '~repositories/recipe.repository';
import { FastifyResponse } from '~types/fastify.type';
import mapperUtil from '~utils/mapper.util';
import objectUtil from '~utils/object.util';
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
				if (orderBy) {
					recipeQuery = recipeQuery.orderBy('recipe.createdAt', OrderBy.DESC);
				} else {
					recipeQuery = recipeQuery.orderBy('recipe.createdAt', orderBy);
				}
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

		for (const recipe of recipes) {
			const images = await imageRepository.findBy({
				type: ImageType.RECIPE,
				entityId: recipe.id
			});

			if (images) {
				recipe.images = images.map((image) => image.url);
			} else {
				recipe.images = [DEFAULT_IMAGE];
			}
		}

		const recipeModeratorResponseModelList: Array<AllRecipeModeratorResponseModel> =
			[];
		recipes.forEach((recipe) => {
			const recipeModeratorResponseModel =
				new AllRecipeModeratorResponseModel();
			recipeModeratorResponseModel.id = recipe.id;
			recipeModeratorResponseModel.name = recipe.name;
			recipeModeratorResponseModel.slug = recipe.slug;
			recipeModeratorResponseModel.image = recipe.images[0];
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
				'foodStyles',
				'mealKits',
				'mealKits.extraSpice'
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
				id: item.id,
				ingredient_id: item.ingredient.id,
				unit_id: item.unit.id,
				amount: item.amount,
				price: item.ingredient.price
			}));

		const nutritionRecipeModeratorResponseModelList: Array<NutritionRecipeModeratorResponseModel> =
			recipe.recipeNutritions.map((item) => ({
				id: item.id,
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
		recipeModeratorResponseModel.mealKits = recipe.mealKits;

		const sold = await orderDetailRepository.count({
			where: {
				isCart: false,
				mealKit: {
					recipe: {
						id: recipe.id
					}
				}
			},
			relations: ['mealKit', 'mealKit.recipe']
		});
		recipeModeratorResponseModel.sold = sold;
		recipeModeratorResponseModel.star = 0;
		recipeModeratorResponseModel.totalFeedbacks = 0;

		const images = await imageRepository.findBy({
			type: ImageType.RECIPE,
			entityId: recipe.id
		});

		if (images) {
			recipeModeratorResponseModel.images = images.map((image) => image.url);
		} else {
			recipeModeratorResponseModel.images = [DEFAULT_IMAGE];
		}

		for (const item of recipeModeratorResponseModel.mealKits) {
			if (item.extraSpice) {
				const images = await imageRepository.findBy({
					type: ImageType.EXTRASPICE,
					entityId: item.extraSpice.id
				});

				if (images[0]) {
					item.extraSpice.image = images[0].url;
				} else {
					item.extraSpice.image = DEFAULT_IMAGE;
				}
			}
		}

		response.data = recipeModeratorResponseModel;
		return response.send();
	}

	async createRecipeHandle(req: FastifyRequest, res: FastifyResponse) {
		const recipeObj = {} as Recipe;
		const files: Array<MultipartFile> = [];
		const imagesExtraSpice: Array<MultipartFile> = [];
		const response = new ResponseModel(res);

		let foodStylesRequest = [];
		let nutritionsRequest = [];
		let ingredientsRequest = [];
		let mealKitsRequest = [];

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
					case 'mealKits':
						mealKitsRequest = await JSON.parse(part.value as any);
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
				} else if (part.fieldname == 'imagesExtraSpice') {
					if (part.mimetype.startsWith('image/')) {
						imagesExtraSpice.push(part);
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

		await recipeRepository.create(newRecipe);

		ingredientsRequest.forEach(async (item: any) => {
			const recipeIngredient = new RecipeIngredient();
			recipeIngredient.amount = item.amount;
			recipeIngredient.ingredient = { id: item.ingredient_id } as Ingredient;
			recipeIngredient.unit = { id: item.unit_id } as Unit;
			recipeIngredient.recipe = newRecipe;
			await recipeIngredientRepository.create(recipeIngredient);
		});

		nutritionsRequest.forEach(async (item: any) => {
			const recipeNutrition = new RecipeNutrition();
			recipeNutrition.amount = item.amount;
			recipeNutrition.nutrition = { id: item.nutrition_id } as Nutrition;
			recipeNutrition.unit = { id: item.unit_id } as Unit;
			recipeNutrition.recipe = newRecipe;
			await recipeNutritionRepository.create(recipeNutrition);
		});

		mealKitsRequest.forEach(async (item: any) => {
			const mealKit = new MealKit();
			mealKit.recipe = newRecipe;
			mealKit.serving = item.mealKit.serving;
			mealKit.price = item.mealKit.price;
			mealKit.status = true;
			await mealKitRepository.create(mealKit);
			if (item.extraSpice) {
				const extraSpice = new ExtraSpice();
				extraSpice.mealKit = mealKit;
				extraSpice.name = item.extraSpice.name;
				extraSpice.price = item.extraSpice.price;

				await extraSpiceRepository.create(extraSpice);

				for (const image of imagesExtraSpice) {
					if (image.filename.includes(item.extraSpice.imageName)) {
						await s3Util.uploadImage({
							data: await image.toBuffer(),
							name: extraSpice.id,
							type: ImageType.EXTRASPICE
						});
						const index = imagesExtraSpice.indexOf(image);
						if (index !== -1) {
							imagesExtraSpice.splice(index, 1);
						}
						break;
					}
				}
			}
		});

		for (const file of files) {
			await s3Util.uploadImage({
				data: await file.toBuffer(),
				name: newRecipe.id,
				type: ImageType.RECIPE
			});
		}

		return response.send();
	}

	async deleteRecipeHandle(req: FastifyRequest, res: FastifyResponse) {
		const { recipe_id }: any = req.params as Object;
		const recipe = await recipeRepository.findOneBy({
			id: recipe_id
		});

		const response = new ResponseModel(res);
		if (!recipe) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}

		const count = await mealKitRepository.count({
			where: {
				recipe: {
					id: recipe.id
				}
			},
			relations: ['recipe']
		});

		if (count != 0) {
			response.message = 'Some meal kit existed in this recipe';
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			return response.send();
		}

		await recipeRepository.removeOne(recipe);

		return response.send();
	}

	async updateRecipeHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: RecipeUpdateRequest = req.body as RecipeUpdateRequest;
		const { id }: any = req.params;

		const response = new ResponseModel(res);
		const recipe = await recipeRepository.findOne({
			where: {
				id
			},
			relations: ['foodStyles']
		});
		if (!recipe) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}

		recipe.name = query.name;
		recipe.category.id = query.category;
		recipe.steps = query.steps;
		recipe.time = query.time;
		recipe.level = query.level;
		recipe.videoUrl = query.videoUrl;
		const foodStyles = await foodStyleRepository.findBy({
			id: In(query.foodStyles)
		});
		recipe.foodStyles = foodStyles;

		recipe.slug =
			stringUtil
				.removeVietnameseTones(recipe.name)
				.toLocaleLowerCase('vi')
				.replaceAll(' ', '-') +
			'.' +
			recipe.id;

		await recipeRepository.update(recipe);

		return response.send();
	}

	async updateRecipeIngredientHandle(
		req: FastifyRequest,
		res: FastifyResponse
	) {
		const query: IngredientRecipeUpdateRequestSchema =
			req.body as IngredientRecipeUpdateRequestSchema;
		const { recipe_id }: any = req.params;

		const response = new ResponseModel(res);
		const recipe = await recipeRepository.findOneBy({
			id: recipe_id
		});
		if (!recipe) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}

		if (query.items?.length) {
			query.items.forEach(async (item) => {
				if (item.id) {
					const ingredient = await recipeIngredientRepository.findOne({
						where: {
							recipe: {
								id: recipe.id
							},
							id: item.id
						},
						relations: ['recipe']
					});
					if (ingredient) {
						ingredient.amount = item.amount;
						ingredient.ingredient = { id: item.ingredient_id } as Ingredient;
						ingredient.unit = { id: item.unit_id } as Unit;
						await recipeIngredientRepository.update(ingredient);
					}
				} else {
					const recipeIngredient = new RecipeIngredient();
					recipeIngredient.amount = item.amount;
					recipeIngredient.ingredient = {
						id: item.ingredient_id
					} as Ingredient;
					recipeIngredient.unit = { id: item.unit_id } as Unit;
					recipeIngredient.recipe = recipe;
					await recipeIngredientRepository.create(recipeIngredient);
				}
			});
		}

		if (query.removeIds?.length) {
			const ingredients = await recipeIngredientRepository.find({
				where: {
					id: In(query.removeIds),
					recipe: {
						id: recipe.id
					}
				},
				relations: ['recipe']
			});
			await recipeIngredientRepository.remove(ingredients);
		}

		return response.send();
	}

	async updateRecipeNutritionHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: NutritionRecipeUpdateRequestSchema =
			req.body as NutritionRecipeUpdateRequestSchema;
		const { recipe_id }: any = req.params;

		const response = new ResponseModel(res);
		const recipe = await recipeRepository.findOneBy({
			id: recipe_id
		});
		if (!recipe) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}

		if (query.items?.length) {
			query.items.forEach(async (item) => {
				if (item.id) {
					const nutrition = await recipeNutritionRepository.findOne({
						where: {
							recipe: {
								id: recipe.id
							},
							id: item.id
						},
						relations: ['recipe']
					});
					if (nutrition) {
						nutrition.amount = item.amount;
						nutrition.nutrition = { id: item.nutrition_id } as Nutrition;
						nutrition.unit = { id: item.unit_id } as Unit;
						await recipeNutritionRepository.update(nutrition);
					}
				} else {
					const recipeNutrition = new RecipeNutrition();
					recipeNutrition.amount = item.amount;
					recipeNutrition.nutrition = { id: item.nutrition_id } as Nutrition;
					recipeNutrition.unit = { id: item.unit_id } as Unit;
					recipeNutrition.recipe = recipe;
					await recipeNutritionRepository.create(recipeNutrition);
				}
			});
		}

		if (query.removeIds?.length) {
			const nutritions = await recipeNutritionRepository.find({
				where: {
					id: In(query.removeIds),
					recipe: {
						id: recipe.id
					}
				},
				relations: ['recipe']
			});
			await recipeNutritionRepository.remove(nutritions);
		}

		return response.send();
	}

	async updateRecipeMealkitHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: MealkitsRecipeUpdateRequestSchema =
			req.body as MealkitsRecipeUpdateRequestSchema;
		const { recipe_id }: any = req.params;

		const response = new ResponseModel(res);
		const recipe = await recipeRepository.findOneBy({
			id: recipe_id
		});
		if (!recipe) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}

		if (query.items?.length) {
			query.items.forEach(async (item) => {
				if (item.mealKit.id) {
					const mealKit = await mealKitRepository.findOne({
						where: {
							id: item.mealKit.id,
							recipe: {
								id: recipe.id
							}
						},
						relations: ['recipe', 'extraSpice']
					});
					if (mealKit) {
						mealKit.recipe = recipe;
						mealKit.serving = item.mealKit.serving;
						mealKit.price = item.mealKit.price;
						mealKit.status = true;
						await mealKitRepository.update(mealKit);
						if (item.extraSpice) {
							if (mealKit.extraSpice) {
								const extraSpice = mealKit.extraSpice;
								extraSpice.name = item.extraSpice.name;
								extraSpice.price = item.extraSpice.price;
								await extraSpiceRepository.update(extraSpice);
							} else {
								const extraSpice = new ExtraSpice();
								extraSpice.mealKit = mealKit;
								extraSpice.name = item.extraSpice.name;
								extraSpice.price = item.extraSpice.price;
								await extraSpiceRepository.create(extraSpice);
							}
						}
					}
				} else {
					const mealKit = new MealKit();
					mealKit.recipe = recipe;
					mealKit.serving = item.mealKit.serving;
					mealKit.price = item.mealKit.price;
					mealKit.status = true;
					await mealKitRepository.create(mealKit);
					if (item.extraSpice) {
						const extraSpice = new ExtraSpice();
						extraSpice.mealKit = mealKit;
						extraSpice.name = item.extraSpice.name;
						extraSpice.price = item.extraSpice.price;
						await extraSpiceRepository.create(extraSpice);
					}
				}
			});
		}

		if (query.removeIds?.length) {
			const mealKits = await mealKitRepository.find({
				where: {
					id: In(query.removeIds),
					recipe: {
						id: recipe.id
					}
				},
				relations: ['recipe']
			});
			await mealKitRepository.remove(mealKits);
		}

		return response.send();
	}
}

export default new RecipeModeratorService();
