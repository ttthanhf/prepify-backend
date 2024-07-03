import { OrderBatch } from '~models/entities/order-batch.entity';
import { BaseRepository } from './base.repository';

class OrderBatchRepository extends BaseRepository<OrderBatch> {
	constructor() {
		super(OrderBatch);
	}
}

export default new OrderBatchRepository();
