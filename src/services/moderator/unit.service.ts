import { FastifyRequest } from 'fastify';
import { OrderBy, SortBy } from '~constants/sort.constant';
import ResponseModel from '~models/responses/response.model';
import { unitModeratorQueryGetRequest } from '~models/schemas/moderator/unit.schemas.model';
import unitRepository from '~repositories/unit.repository';
import { FastifyResponse } from '~types/fastify.type';

class UnitModeratorService {
	async getUnitHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: unitModeratorQueryGetRequest =
			req.query as unitModeratorQueryGetRequest;

		const pageSize =
			query.pageSize && query.pageSize <= 50 && query.pageSize > 0
				? query.pageSize
				: 50;

		const pageIndex =
			query.pageIndex && query.pageIndex > 0 ? query.pageIndex : 1;

		const orderBy = query.orderBy ? query.orderBy : OrderBy.ASC;

		// All the fields that are loaded using loadRelationCountAndMap cannot be used in orderBy, where, or groupBy
		let unitQuery = unitRepository
			.getRepository()
			.createQueryBuilder('unit')
			.loadRelationCountAndMap(
				'unit.totalRecipeNutritions',
				'unit.recipeNutritions'
			)
			.loadRelationCountAndMap(
				'unit.totalRecipeIngredients',
				'unit.recipeIngredients'
			)
			.loadRelationCountAndMap('unit.totalIngredients', 'unit.ingredients')
			.addOrderBy('unit.totalRecipeNutritions', 'DESC')
			.take(Number(pageSize))
			.skip((Number(pageIndex) - 1) * Number(pageSize));

		switch (query.sortBy) {
			case SortBy.NAME:
				unitQuery = unitQuery.orderBy('unit.name', orderBy);
				break;
			default:
				unitQuery = unitQuery.orderBy('unit.createdAt', orderBy);
				break;
		}

		if (query.searchUnit) {
			unitQuery = unitQuery.andWhere(
				`LOWER(REPLACE(unit.name, ' ', '')) LIKE LOWER(REPLACE(:searchUnit, ' ', ''))`,
				{
					searchUnit: `%${query.searchUnit}%`
				}
			);
		}

		const units = await unitQuery.getMany();
		const itemTotal = units.length;
		const pageTotal = Math.ceil(itemTotal / Number(pageSize));

		const response = new ResponseModel(res);
		response.data = {
			data: units,
			itemTotal,
			pageTotal,
			pageIndex,
			pageSize
		};

		return response.send();
	}
}

export default new UnitModeratorService();
