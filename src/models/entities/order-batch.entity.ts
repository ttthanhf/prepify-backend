import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Order } from './order.entity';
import { Batch } from './batch.entity';
import { OrderStatus } from '../../constants/orderstatus.constant';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'order_batch' })
export class OrderBatch {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@ManyToOne()
	order!: Order;

	@ManyToOne()
	batch!: Batch;

	@Enum(() => OrderStatus)
	status!: OrderStatus;

	@Property()
	datetime!: Date;
}
