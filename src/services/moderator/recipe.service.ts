import { _Object } from '@aws-sdk/client-s3';
import { FastifyRequest } from 'fastify';
import envConfig from '~configs/env.config';
import { DEFAULT_IMAGE } from '~constants/default.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import { RecipeModeratorResponseModel } from '~models/responses/moderator/recipe.response';
import ResponseModel from '~models/responses/response.model';
import { recipeModeratorQueryGetRequest } from '~models/schemas/moderator/recipe.schemas.model';
import recipeRepository from '~repositories/recipe.repository';
import { FastifyResponse } from '~types/fastify.type';
import redisUtil from '~utils/redis.util';
import s3Util from '~utils/s3.util';

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
}

export default new RecipeModeratorService();
