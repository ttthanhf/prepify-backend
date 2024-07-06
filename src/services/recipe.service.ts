import { _Object } from '@aws-sdk/client-s3';
import { DEFAULT_IMAGE } from '~constants/default.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { ImageType } from '~constants/image.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import {
	RecipeDetailShopResponse,
	RecipeShopResponseModel as RecipeShopResponseModel
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
				'mealKit.rating',
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

		const recipeShopResponseModelList: Array<RecipeShopResponseModel> = [];
		recipes.forEach((recipe) => {
			const recipeShopResponseModel = new RecipeShopResponseModel();
			recipeShopResponseModel.id = recipe.id;
			recipeShopResponseModel.name = recipe.name;
			recipeShopResponseModel.slug = recipe.slug;
			recipeShopResponseModel.foodStyle = recipe?.foodStyles?.[0]?.name;
			recipeShopResponseModel.mainImage = recipe.images[0] || DEFAULT_IMAGE;
			recipeShopResponseModel.subImage = recipe.images[1] || DEFAULT_IMAGE;
			recipeShopResponseModel.level = recipe.level;
			recipeShopResponseModel.time = recipe.time;

			if (recipe.mealKits.length != 0) {
				let lowestPriceMealKit = recipe.mealKits[0];
				for (let i = 1; i < recipe.mealKits.length; i++) {
					if (recipe.mealKits[i].price < lowestPriceMealKit.price) {
						lowestPriceMealKit = recipe.mealKits[i];
					}
				}
				recipeShopResponseModel.price = lowestPriceMealKit.price;
				recipeShopResponseModel.star = lowestPriceMealKit.rating;
			}

			recipeShopResponseModelList.push(recipeShopResponseModel);
		});

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
			relations: ['mealKits', 'mealKits.extraSpice']
		});
		const response = new ResponseModel(res);
		if (!recipe) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			response.message = 'Item not found';
			return response.send();
		}

		const recipeDetailShopResponse = mapperUtil.mapEntityToClass(
			recipe,
			RecipeDetailShopResponse
		);

		for (const item of recipe.mealKits) {
			if (item.extraSpice) {
				const images = await imageRepository.findBy({
					type: ImageType.EXTRASPICE,
					entityId: item.extraSpice.id
				});

				item.extraSpice.image = images[0] ? images[0].url : DEFAULT_IMAGE;
			}
		}

		const images = await imageRepository.findBy({
			type: ImageType.RECIPE,
			entityId: recipe.id
		});

		if (images) {
			recipeDetailShopResponse.images = images.map((image) => image.url);
		} else {
			recipeDetailShopResponse.images = [DEFAULT_IMAGE];
		}

		recipeDetailShopResponse.totalFeedback = 0;
		recipeDetailShopResponse.star = 0;

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

		recipeDetailShopResponse.sold = sold;

		response.data = recipeDetailShopResponse;
		return response.send();
	}
}

export default new RecipeService();
