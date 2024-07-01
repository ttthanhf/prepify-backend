import { FastifyRequest } from 'fastify';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import { Category } from '~models/entities/category.entity';
import ResponseModel from '~models/responses/response.model';
import {
	categoryModeratorQueryCreateRequest,
	categoryModeratorQueryGetRequest
} from '~models/schemas/moderator/category.schemas.model';
import categoryRepository from '~repositories/category,repository';
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
			.leftJoinAndSelect('category.recipes', 'recipe')
			.select(['category.id AS id', 'category.name AS name'])
			.addSelect('COUNT(category.id)', 'totalRecipes')
			.groupBy('category.id')
			.take(pageSize)
			.skip((pageIndex - 1) * pageSize);

		switch (query.sortBy) {
			case SortBy.NAME:
				categoryQuery = categoryQuery.orderBy('category.name', orderBy);
				break;
			case SortBy.TOTALRECIPES:
				categoryQuery = categoryQuery.orderBy('totalRecipes', orderBy);
				break;
			default:
				categoryQuery = categoryQuery.orderBy('category.name', orderBy);
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

		const categories = await categoryQuery.getRawMany();

		// Convert totalRecipes to a number
		const formattedCategories = categories.map((category) => ({
			...category,
			totalRecipes: Number(category.totalRecipes)
		}));

		const itemTotal = categories.length;
		const pageTotal = Math.ceil(itemTotal / pageSize);

		const response = new ResponseModel(res);
		response.data = {
			data: formattedCategories,
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
}

export default new CategoryModeratorService();
