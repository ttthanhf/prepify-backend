import { FastifyRequest } from 'fastify';
import { DEFAULT_IMAGE } from '~constants/default.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import { IngredientModeratorGetResponse } from '~models/responses/moderator/ingredient.response';
import ResponseModel from '~models/responses/response.model';
import { IngredientModeratorQueryGetRequest } from '~models/schemas/moderator/ingredient.schemas.model';
import ingredientRepository from '~repositories/ingredient.repository';
import { FastifyResponse } from '~types/fastify.type';
import mapperUtil from '~utils/mapper.util';

class IngredientModeratorService {
	async getAllIngredientHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: IngredientModeratorQueryGetRequest =
			req.query as IngredientModeratorQueryGetRequest;

		const pageSize =
			query.pageSize && query.pageSize <= 100 && query.pageSize > 0
				? query.pageSize
				: 10;

		const pageIndex =
			query.pageIndex && query.pageIndex > 0 ? query.pageIndex : 1;

		const orderBy = query.orderBy ? query.orderBy : OrderBy.ASC;

		let ingredientQuery = ingredientRepository
			.getRepository()
			.createQueryBuilder('ingredient')
			.leftJoinAndSelect('ingredient.unit', 'unit')
			.groupBy('ingredient.id')
			.addGroupBy('unit.id')
			.take(pageSize)
			.skip((pageIndex - 1) * pageSize);

		switch (query.sortBy) {
			case SortBy.NAME:
				ingredientQuery = ingredientQuery.orderBy('ingredient.name', orderBy);
				break;
			case SortBy.PRICE:
				ingredientQuery = ingredientQuery.orderBy('ingredient.price', orderBy);
				break;
			case SortBy.UNIT:
				ingredientQuery = ingredientQuery.orderBy('unit.name', orderBy);
				break;
			case SortBy.CATEGORY:
				ingredientQuery = ingredientQuery.orderBy(
					'ingredient.category',
					orderBy
				);
				break;
		}

		if (query.search) {
			ingredientQuery = ingredientQuery.andWhere(
				`LOWER(REPLACE(ingredient.name, ' ', '')) LIKE LOWER(REPLACE(:search, ' ', ''))`,
				{
					search: `%${query.search}%`
				}
			);
		}

		const [ingredients, itemTotal] = await ingredientQuery.getManyAndCount();

		const pageTotal = Math.ceil(itemTotal / pageSize);

		const ingredientModeratorGetResponseList: Array<IngredientModeratorGetResponse> =
			[];

		ingredients.forEach((item) => {
			const ingredientModeratorGetResponse = mapperUtil.mapEntityToClass(
				item,
				IngredientModeratorGetResponse
			);
			ingredientModeratorGetResponse.unit = item.unit.name;
			ingredientModeratorGetResponse.image = DEFAULT_IMAGE;
			ingredientModeratorGetResponseList.push(ingredientModeratorGetResponse);
		});

		const response = new ResponseModel(res);
		response.data = {
			data: ingredientModeratorGetResponseList,
			itemTotal,
			pageTotal,
			pageIndex,
			pageSize
		};
		return response.send();
	}
}

export default new IngredientModeratorService();
