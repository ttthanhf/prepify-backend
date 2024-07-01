import { FastifyRequest } from 'fastify';
import { OrderBy, SortBy } from '~constants/sort.constant';
import ResponseModel from '~models/responses/response.model';
import { categoryModeratorQueryGetRequest } from '~models/schemas/moderator/category.schemas.model';
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
		const itemTotal = categories.length;

		const pageTotal = Math.ceil(itemTotal / pageSize);

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
}

export default new CategoryModeratorService();
