import { OrderBy, SortBy } from '~constants/sort.constant';
import ResponseModel from '~models/responses/response.model';
import { orderModeratorQueryGetRequest } from '~models/schemas/moderator/order.schemas.model';
import orderRepository from '~repositories/order.repository';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class OrderModeratorService {
	async getOrdersHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: orderModeratorQueryGetRequest =
			req.query as orderModeratorQueryGetRequest;

		const pageSize =
			query.pageSize && query.pageSize <= 50 && query.pageSize > 0
				? query.pageSize
				: 50;

		const pageIndex =
			query.pageIndex && query.pageIndex > 0 ? query.pageIndex : 1;

		const orderBy = query.orderBy ? query.orderBy : OrderBy.ASC;

		let orderQuery = orderRepository
			.getRepository()
			.createQueryBuilder('order')
			.leftJoinAndSelect('order.customer', 'customer')
			.leftJoinAndSelect('customer.user', 'user')
			.leftJoinAndSelect('order.area', 'area')
			.loadRelationCountAndMap('order.totalOrderDetails', 'order.orderDetails')
			.take(pageSize)
			.skip((pageIndex - 1) * pageSize);

		// sortBy deliveredBy | status | orderDate
		switch (query.sortBy) {
			case SortBy.DELIVEREDBY:
				orderQuery = orderQuery.orderBy('order.name', orderBy);
				break;
			case SortBy.STATUS:
				orderQuery = orderQuery.orderBy('user.name', orderBy);
				break;
			case SortBy.ORDERDATE:
				orderQuery = orderQuery.orderBy('order.datetime', orderBy);
				break;
			default:
				orderQuery = orderQuery.orderBy('order.datetime', OrderBy.DESC);
				break;
		}

		// search by orderCode | deliveredBy [key: search]
		if (query.search) {
			orderQuery = orderQuery.andWhere(
				`LOWER(REPLACE(order.trackingNumber, ' ', '')) LIKE LOWER(REPLACE(:search, ' ', ''))`,
				{
					search: `%${query.search}%`
				}
			);
		}

		// filter by area name [key: area]
		if (query.area) {
			orderQuery = orderQuery.andWhere('LOWER(area.name) = LOWER(:area)', {
				area: query.area
			});
		}

		// filter by status [key: status]
		if (query.status) {
			orderQuery = orderQuery.andWhere('order.status = :status', {
				status: query.status
			});
		}

		const [orders, itemTotal] = await orderQuery.getManyAndCount();
		const pageTotal = Math.ceil(itemTotal / pageSize);

		// override entity by field name
		const formattedOrders = orders.map((order) => {
			return {
				...order,
				area: order.area.name,
				customer: order.customer.user.fullname
			};
		});

		const response = new ResponseModel(res);
		response.data = {
			data: formattedOrders,
			itemTotal,
			pageTotal,
			pageIndex,
			pageSize
		};

		return response.send();
	}
}

export default new OrderModeratorService();
