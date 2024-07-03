import { FastifyRequest } from 'fastify';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import { Category } from '~models/entities/category.entity';
import { Recipe } from '~models/entities/recipe.entity';
import ResponseModel from '~models/responses/response.model';
import {
	categoryModeratorQueryCreateRequest,
	categoryModeratorQueryGetRequest,
	categoryModeratorQueryUpdateRequest
} from '~models/schemas/moderator/category.schemas.model';
import categoryRepository from '~repositories/category,repository';
import recipeRepository from '~repositories/recipe.repository';
import { FastifyResponse } from '~types/fastify.type';

class CategoryModeratorService {
	async getCategoryHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: categoryModeratorQueryGetRequest =
			req.query as categoryModeratorQueryGetRequest;

		const pageSize =
			query.pageSize && query.pageSize <= 50 && query.pageSize > 0
				? query.pageSize
				: 50;

		const pageIndex =
			query.pageIndex && query.pageIndex > 0 ? query.pageIndex : 1;

		const orderBy = query.orderBy ? query.orderBy : OrderBy.ASC;

		let categoryQuery = categoryRepository
			.getRepository()
			.createQueryBuilder('category')
			.select(['category.id', 'category.name'])
			.addSelect((subQuery) => {
				return subQuery
					.select('COUNT(recipe.id)', 'count')
					.from(Recipe, 'recipe')
					.where('recipe.category.id = category.id');
			}, 'recipesCount')
			.loadRelationCountAndMap('category.totalRecipes', 'category.recipes')
			.take(Number(pageSize))
			.skip((Number(pageIndex) - 1) * Number(pageSize));

		switch (query.sortBy) {
			case SortBy.NAME:
				categoryQuery = categoryQuery.orderBy('category.name', orderBy);
				break;
			case SortBy.TOTALRECIPES:
				categoryQuery = categoryQuery.orderBy('recipesCount', orderBy);
				break;
			default:
				categoryQuery = categoryQuery.orderBy('category.createdAt', orderBy);
				break;
		}

		if (query.searchCategory) {
			categoryQuery = categoryQuery.andWhere(
				`LOWER(REPLACE(category.name, ' ', '')) LIKE LOWER(REPLACE(:searchCategory, ' ', ''))`,
				{
					searchCategory: `%${query.searchCategory}%`
				}
			);
		}

		const [categories, itemTotal] = await categoryQuery.getManyAndCount();

		const pageTotal = Math.ceil(itemTotal / Number(pageSize));

		const response = new ResponseModel(res);
		response.data = {
			data: categories,
			itemTotal,
			pageTotal,
			pageIndex,
			pageSize
		};

		return response.send();
	}

	async createCategoryHandle(req: FastifyRequest, res: FastifyResponse) {
		const { name } = req.body as categoryModeratorQueryCreateRequest;

		const response = new ResponseModel(res);
		try {
			const existingCategory = await categoryRepository.findOne({
				where: {
					name
				}
			});

			if (existingCategory) {
				response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
				response.message = 'Category already exists';
				return response.send();
			}

			const category = new Category();
			category.name = name;

			await categoryRepository.create(category);

			response.message = 'Category created successfully';
			return response.send();
		} catch (error) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Failed to create category';
			return response.send();
		}
	}

	async updateCategoryHandle(req: FastifyRequest, res: FastifyResponse) {
		const { id }: any = req.params as Object;
		const { name } = req.body as categoryModeratorQueryUpdateRequest;

		const category = await categoryRepository.findOneBy({
			id: id
		});

		const response = new ResponseModel(res);
		if (!category) {
			response.message = 'Category not found';
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			return response.send();
		}

		// Check if the category name already exists
		const existingCategory = await categoryRepository.findOne({
			where: {
				name
			}
		});

		if (existingCategory) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Category already exists';
			return response.send();
		}

		try {
			category.name = name;

			await categoryRepository.update(category);
			response.message = 'Category updated successfully';
			return response.send();
		} catch (error) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Failed to update category';
			return response.send();
		}
	}

	async deleteCategoryHandle(req: FastifyRequest, res: FastifyResponse) {
		const { id }: any = req.params as Object;

		const category = await categoryRepository.findOneBy({
			id: id
		});

		const response = new ResponseModel(res);
		if (!category) {
			response.message = 'Category not found';
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			return response.send();
		}

		// Check if the category has any recipes
		const existingRecipe = await recipeRepository.findOneBy({
			category: category
		});

		if (existingRecipe) {
			response.message = 'Category has recipes';
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			return response.send();
		}

		try {
			await categoryRepository.removeOne(category);
			response.message = 'Category deleted successfully';
			return response.send();
		} catch (error) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Failed to delete category';
			return response.send();
		}
	}
}

export default new CategoryModeratorService();
