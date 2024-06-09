import { BaseRepository } from './base.repository';
import { OrderDetail } from '~models/entities/order-detail.entity';

class OrderDetailRepository extends BaseRepository<OrderDetail> {
	constructor() {
		super(OrderDetail);
	}
}

export default new OrderDetailRepository();
