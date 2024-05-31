import { Entity, Enum, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { OrderStatus } from '~constants/orderstatus.constant';
import { Batch } from './batch.entity';
import { Order } from './order.entity';

@Entity({ tableName: 'order_batch' })
export class OrderBatch {
	@ManyToOne({ entity: () => Order, primary: true })
	order!: Rel<Order>;

	@ManyToOne({ entity: () => Batch, primary: true })
	batch!: Rel<Batch>;

	@Enum(() => OrderStatus)
	status!: OrderStatus;

	@Property()
	datetime?: Date;
}
