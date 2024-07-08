import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import ResponseModel from '~models/responses/response.model';
import { orderModeratorQueryGetRequest } from '~models/schemas/moderator/order.schemas.model';
import mealKitRepository from '~repositories/mealKit.repository';
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
			case SortBy.STATUS:
				orderQuery = orderQuery.orderBy('order.status', orderBy);
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
			const areas = query.area.split(',');
			orderQuery = orderQuery.andWhere('LOWER(area.name) IN (:...areas)', {
				areas
			});
		}

		// filter by status [key: status]
		if (query.status) {
			const statuses = query.status.split(',');
			orderQuery = orderQuery.andWhere('order.status IN (:...statuses)', {
				statuses
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

	async getOrderByIdHandle(req: FastifyRequest, res: FastifyResponse) {
		const { id } = req.params as { id: string };
		const response = new ResponseModel(res);
		try {
			const order = await orderRepository.getRepository().findOne({
				where: { id },
				relations: [
					'customer',
					'area',
					'orderDetails',
					'customer.user',
					'orderDetails.mealKit',
					'orderDetails.mealKit.recipe'
				]
			});

			if (!order) {
				response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
				response.message = 'Order not found';
				return response.send();
			}

			// Fetch extraSpice conditionally
			for (const orderDetail of order.orderDetails) {
				if (orderDetail.has_extra_spice) {
					const mealKit = await mealKitRepository.findOne({
						where: { id: orderDetail.mealKit.id },
						relations: ['extraSpice']
					});
					orderDetail.mealKit.extraSpice = mealKit?.extraSpice ?? null;
				}
			}

			response.data = order;
			return response.send();
		} catch (error) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Internal server error';
			return response.send();
		}
	}
}

export default new OrderModeratorService();
