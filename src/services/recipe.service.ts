import { _Object } from '@aws-sdk/client-s3';
import { DEFAULT_IMAGE } from '~constants/default.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { ImageType } from '~constants/image.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import {
	FoodStylesRecipeDetailShopResponse,
	IngredientsRecipeDetailShopResponse,
	ItemRecipeDetailShopResponse,
	NutritionRecipeDetailShopResponse,
	RecipeDetailShopResponse,
	RecipeShopResponseModel as RecipeShopResponseModel,
	UnitRecipeDetailShopResponse
} from '~models/responses/recipe.reponse.model';
import ResponseModel from '~models/responses/response.model';
import { RecipeGetRequest } from '~models/schemas/recipe.schemas.model';
import imageRepository from '~repositories/image.repository';
import orderDetailRepository from '~repositories/orderDetail.repository';
import recipeRepository from '~repositories/recipe.repository';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import mapperUtil from '~utils/mapper.util';

class RecipeService {
	async getAllRecipeHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: RecipeGetRequest = req.query as RecipeGetRequest;

		const pageSize =
			query.pageSize && query.pageSize <= 9 && query.pageSize > 0
				? query.pageSize
				: 9;

		const pageIndex =
			query.pageIndex && query.pageIndex > 0 ? query.pageIndex : 1;

		const orderBy = query.orderBy ? query.orderBy : OrderBy.ASC;
		const sortBy = query.sortBy ? query.sortBy : SortBy.POPULAR;

		const minPrice = query.minPrice && query.minPrice >= 0 ? query.minPrice : 0;
		const maxPrice =
			query.maxPrice && query.maxPrice >= 0 && query.maxPrice <= 10000000
				? query.maxPrice
				: 10000000;

		const minRating =
			query.minRating && query.minRating >= 0 && query.minRating <= 5
				? query.minRating
				: 0;
		const maxRating =
			query.maxRating && query.maxRating >= 0 && query.maxRating <= 5
				? query.maxRating
				: 5;

		let recipeQuery = recipeRepository
			.getRepository()
			.createQueryBuilder('recipe')
			.innerJoinAndSelect('recipe.mealKits', 'mealKit')
			.leftJoinAndSelect('mealKit.orderDetails', 'orderDetail')
			.leftJoinAndSelect('recipe.foodStyles', 'foodStyle')
			.groupBy('recipe.id')
			.addGroupBy('mealKit.id')
			.addGroupBy('orderDetail.id')
			.addGroupBy('foodStyle.id')
			.take(pageSize)
			.skip((pageIndex - 1) * pageSize)
			.select([
				'recipe.id',
				'recipe.name',
				'recipe.slug',
				'recipe.level',
				'recipe.time',
				'recipe.createdAt',
				'mealKit.price',
				'mealKit.sold',
				'recipe.rating',
				'foodStyle.name'
			])
			.where('mealKit.status = true');

		if (sortBy === SortBy.POPULAR) {
			recipeQuery = recipeQuery
				.addSelect('COUNT(orderDetail.id)', 'orderDetailCount')
				.orderBy('orderDetailCount', orderBy);
		} else if (sortBy === SortBy.PRICE) {
			recipeQuery = recipeQuery.orderBy('mealKit.price', orderBy);
		} else if (sortBy === SortBy.NEWEST) {
			recipeQuery = recipeQuery.orderBy('recipe.createdAt', orderBy);
		}

		if (query.foodStyles) {
			const foodStyleSlugs = query.foodStyles.split(',');
			recipeQuery = recipeQuery.andWhere(
				'foodStyle.slug IN (:...foodStyleSlugs)',
				{ foodStyleSlugs }
			);
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
				'recipe.rating BETWEEN :minRating AND :maxRating',
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

		const [recipes, itemTotal] = await recipeQuery.getManyAndCount();

		const pageTotal = Math.ceil(itemTotal / pageSize);

		const recipeShopResponseModelList: Array<RecipeShopResponseModel> = [];
		for (const recipe of recipes) {
			let totalSold = 0;

			const images = await imageRepository.findBy({
				type: ImageType.RECIPE,
				entityId: recipe.id
			});

			if (images) {
				recipe.images = images.map((image) => image.url);
			} else {
				recipe.images = [DEFAULT_IMAGE];
			}

			const recipeShopResponseModel = new RecipeShopResponseModel();
			recipeShopResponseModel.id = recipe.id;
			recipeShopResponseModel.name = recipe.name;
			recipeShopResponseModel.slug = recipe.slug;
			recipeShopResponseModel.foodStyle = recipe?.foodStyles?.[0]?.name;
			recipeShopResponseModel.mainImage = recipe.images[0] || DEFAULT_IMAGE;
			recipeShopResponseModel.subImage = recipe.images[1]
				? recipe.images[1]
				: recipeShopResponseModel.mainImage;
			recipeShopResponseModel.level = recipe.level;
			recipeShopResponseModel.time = recipe.time;

			if (recipe.mealKits.length != 0) {
				let lowestPriceMealKit = recipe.mealKits[0];
				totalSold += lowestPriceMealKit.sold;
				for (let i = 1; i < recipe.mealKits.length; i++) {
					if (recipe.mealKits[i].price > lowestPriceMealKit.price) {
						lowestPriceMealKit = recipe.mealKits[i];
					}
					totalSold += recipe.mealKits[i].sold;
				}
				recipeShopResponseModel.price = lowestPriceMealKit.price;
			}

			recipeShopResponseModel.star = recipe.rating;
			recipeShopResponseModel.sold = totalSold;

			recipeShopResponseModelList.push(recipeShopResponseModel);
		}

		const response = new ResponseModel(res);
		response.data = {
			recipes: recipeShopResponseModelList,
			itemTotal,
			pageIndex,
			pageSize,
			pageTotal
		};
		return response.send();
	}

	async getRecipeHandle(req: FastifyRequest, res: FastifyResponse) {
		const { slug }: any = req.params;

		const recipe = await recipeRepository.findOne({
			where: {
				slug
			},
			order: {
				mealKits: {
					serving: 'ASC'
				}
			},
			relations: [
				'mealKits',
				'mealKits.extraSpice',
				'category',
				'foodStyles',
				'recipeIngredients',
				'recipeIngredients.unit',
				'recipeIngredients.ingredient',
				'recipeNutritions',
				'recipeNutritions.unit',
				'recipeNutritions.nutrition'
			]
		});
		const response = new ResponseModel(res);
		if (!recipe) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}

		let totalSold = 0;
		for (const item of recipe.mealKits) {
			totalSold += item.sold;

			if (item.extraSpice) {
				const images = await imageRepository.findBy({
					type: ImageType.EXTRASPICE,
					entityId: item.extraSpice.id
				});

				item.extraSpice.image = images[0] ? images[0].url : DEFAULT_IMAGE;
			}
		}

		const itemRecipeDetailShopResponse = mapperUtil.mapEntityToClass(
			recipe,
			ItemRecipeDetailShopResponse
		);

		const images = await imageRepository.findBy({
			type: ImageType.RECIPE,
			entityId: recipe.id
		});

		if (images) {
			itemRecipeDetailShopResponse.images = images.map((image) => image.url);
		} else {
			itemRecipeDetailShopResponse.images = [DEFAULT_IMAGE];
		}

		if (itemRecipeDetailShopResponse.mealKits.extraSpice) {
			const image = await imageRepository.findOneBy({
				type: ImageType.EXTRASPICE,
				entityId: itemRecipeDetailShopResponse.mealKits.extraSpice.id
			});

			itemRecipeDetailShopResponse.mealKits.extraSpice.image = image
				? image.url
				: DEFAULT_IMAGE;
		}

		itemRecipeDetailShopResponse.sold = totalSold;
		itemRecipeDetailShopResponse.totalFeedback = recipe.totalFeedback;
		itemRecipeDetailShopResponse.star = recipe.rating;

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

		itemRecipeDetailShopResponse.sold = sold;

		const foodStylesRecipeDetailShopResponseList: Array<FoodStylesRecipeDetailShopResponse> =
			[];
		recipe.foodStyles.forEach((item) => {
			const foodStylesRecipeDetailShopResponse = mapperUtil.mapEntityToClass(
				item,
				FoodStylesRecipeDetailShopResponse
			);
			foodStylesRecipeDetailShopResponseList.push(
				foodStylesRecipeDetailShopResponse
			);
		});

		const ingredientsRecipeDetailShopResponseList: Array<IngredientsRecipeDetailShopResponse> =
			[];
		for (const item of recipe.recipeIngredients) {
			const ingredientsRecipeDetailShopResponse = mapperUtil.mapEntityToClass(
				item.ingredient,
				IngredientsRecipeDetailShopResponse
			);
			ingredientsRecipeDetailShopResponse.amount = item.amount;
			const unit = mapperUtil.mapEntityToClass(
				item.unit,
				UnitRecipeDetailShopResponse
			);
			ingredientsRecipeDetailShopResponse.unit = unit;

			const image = await imageRepository.findOneBy({
				type: ImageType.INGREDIENT,
				entityId: item.ingredient.id
			});

			if (image) {
				ingredientsRecipeDetailShopResponse.imageURL = image.url;
			} else {
				ingredientsRecipeDetailShopResponse.imageURL = DEFAULT_IMAGE;
			}

			ingredientsRecipeDetailShopResponseList.push(
				ingredientsRecipeDetailShopResponse
			);
		}

		const nutritionRecipeDetailShopResponseList: Array<NutritionRecipeDetailShopResponse> =
			[];
		recipe.recipeNutritions.forEach((item) => {
			const nutritionRecipeDetailShopResponse = mapperUtil.mapEntityToClass(
				item.nutrition,
				NutritionRecipeDetailShopResponse
			);
			nutritionRecipeDetailShopResponse.amount = item.amount;
			const unit = mapperUtil.mapEntityToClass(
				item.unit,
				UnitRecipeDetailShopResponse
			);
			nutritionRecipeDetailShopResponse.units = unit;
			nutritionRecipeDetailShopResponseList.push(
				nutritionRecipeDetailShopResponse
			);
		});

		const recipeDetailShopResponse = new RecipeDetailShopResponse();
		recipeDetailShopResponse.recipe = itemRecipeDetailShopResponse;
		recipeDetailShopResponse.foodStyles =
			foodStylesRecipeDetailShopResponseList;
		recipeDetailShopResponse.ingredients =
			ingredientsRecipeDetailShopResponseList;
		recipeDetailShopResponse.nutritions = nutritionRecipeDetailShopResponseList;

		response.data = recipeDetailShopResponse;
		return response.send();
	}
}

export default new RecipeService();
