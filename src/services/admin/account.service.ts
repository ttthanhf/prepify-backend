import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import { User } from '~models/entities/user.entity';
import { AccountAdminGetResponse } from '~models/responses/admin/account.response';
import ResponseModel from '~models/responses/response.model';
import {
	AccountAdminQueryCreateRequest,
	AccountAdminQueryGetRequest
} from '~models/schemas/admin/account.schemas.model';
import areaRepository from '~repositories/area.repository';
import userRepository from '~repositories/user.repository';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import bcryptUtil from '~utils/bcrypt.util';
import mapperUtil from '~utils/mapper.util';

class AccountAdminService {
	async getAllAccount(req: FastifyRequest, res: FastifyResponse) {
		const query: AccountAdminQueryGetRequest =
			req.query as AccountAdminQueryGetRequest;

		const pageSize =
			query.pageSize && query.pageSize <= 50 && query.pageSize > 0
				? query.pageSize
				: 50;

		const pageIndex =
			query.pageIndex && query.pageIndex > 0 ? query.pageIndex : 1;

		const orderBy = query.orderBy ? query.orderBy : OrderBy.ASC;

		let accountQuery = userRepository
			.getRepository()
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.area', 'area')
			.groupBy('user.id')
			.addGroupBy('area.id')
			.where('user.role != :role', { role: 'ADMIN' })
			.take(pageSize)
			.skip((pageIndex - 1) * pageSize);

		switch (query.sortBy) {
			case SortBy.AREA:
				accountQuery = accountQuery.orderBy('area.name', orderBy);
				break;
			case SortBy.PHONE:
				accountQuery = accountQuery.orderBy('user.phone', orderBy);
				break;
			case SortBy.NAME:
				accountQuery = accountQuery.orderBy('user.fullname', orderBy);
				break;
			case SortBy.EMAIL:
				accountQuery = accountQuery.orderBy('user.email', orderBy);
				break;
			case SortBy.ADDRESS:
				accountQuery = accountQuery.orderBy('user.address', orderBy);
				break;
		}

		if (query.role) {
			const roles = query.role.split(',');
			accountQuery = accountQuery.andWhere('user.role IN (:...roles)', {
				roles
			});
		}

		if (query.area) {
			const area = query.area.split(',');
			accountQuery = accountQuery.andWhere('area.name IN (:...area)', {
				area
			});
		}

		if (query.search) {
			accountQuery = accountQuery.andWhere(
				`LOWER(REPLACE(user.fullname, ' ', '')) LIKE LOWER(REPLACE(:search, ' ', ''))`,
				{ search: '%' + query.search + '%' }
			);
		}

		const [accounts, itemTotal] = await accountQuery.getManyAndCount();

		const pageTotal = Math.ceil(itemTotal / pageSize);

		const accountList: Array<AccountAdminGetResponse> = [];
		accounts.forEach((item) => {
			const account = mapperUtil.mapEntityToClass(
				item,
				AccountAdminGetResponse
			);
			account.area = item.area ? item.area.name : '';
			accountList.push(account);
		});

		const response = new ResponseModel(res);
		response.data = {
			data: accountList,
			itemTotal,
			pageTotal,
			pageIndex,
			pageSize
		};
		return response.send();
	}

	async createAccount(req: FastifyRequest, res: FastifyResponse) {
		const query: AccountAdminQueryCreateRequest =
			req.body as AccountAdminQueryCreateRequest;

		const area = await areaRepository.findOneBy({
			id: query.areaId
		});
		const response = new ResponseModel(res);
		if (!area) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}
		const user = mapperUtil.mapEntityToClass(query, User);
		user.area = area;
		user.password = await bcryptUtil.hash('123');
		await userRepository.create(user);

		return response.send();
	}
}

export default new AccountAdminService();
