import { Order } from '~models/entities/order.entity';
import { BaseRepository } from './base.repository';

class OrderRepository extends BaseRepository<Order> {
	constructor() {
		super(Order);
	}
}

export default new OrderRepository();
