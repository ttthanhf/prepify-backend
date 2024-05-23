import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Order } from './order.entity';
import { Batch } from './batch.entity';
import { OrderStatus } from '../../constants/orderstatus.constant';

@Entity({ tableName: 'order_batch' })
export class OrderBatch {
	@PrimaryKey()
	@Property({ autoincrement: true, primary: true })
	id!: number;

	@ManyToOne()
	order!: Order;

	@ManyToOne()
	batch!: Batch;

	@Enum(() => OrderStatus)
	status!: OrderStatus;

	@Property()
	datetime!: Date;
}
