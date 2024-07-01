import { _Object } from '@aws-sdk/client-s3';
import envConfig from '~configs/env.config';
import { DEFAULT_IMAGE } from '~constants/default.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import { RecipeShopResponseModel as RecipeShopResponseModel } from '~models/responses/recipe.reponse.model';
import ResponseModel from '~models/responses/response.model';
import { RecipeGetRequest } from '~models/schemas/recipe.schemas.model';
import recipeRepository from '~repositories/recipe.repository';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import redisUtil from '~utils/redis.util';
import s3Util from '~utils/s3.util';

class RecipeService {
	async getRecipeHandle(req: FastifyRequest, res: FastifyResponse) {
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
			]);

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

		const recipeShopResponseModelList: Array<RecipeShopResponseModel> = [];
		recipes.forEach((recipe) => {
			const recipeShopResponseModel = new RecipeShopResponseModel();
			recipeShopResponseModel.id = recipe.id;
			recipeShopResponseModel.name = recipe.name;
			recipeShopResponseModel.slug = recipe.slug;
			recipeShopResponseModel.foodStyle = recipe?.foodStyles?.[0]?.name;
			recipeShopResponseModel.mainImage = recipe?.images[0] || DEFAULT_IMAGE;
			recipeShopResponseModel.subImage = recipe?.images[1] || DEFAULT_IMAGE;
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
}

export default new RecipeService();
