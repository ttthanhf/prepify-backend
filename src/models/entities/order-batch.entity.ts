import { Order } from './order.entity';
import { Batch } from './batch.entity';
import { OrderStatus } from '~constants/orderstatus.constant';
import { v4 as uuidv4 } from 'uuid';
import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';

@Entity({ name: 'order_batch' })
export class OrderBatch {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@ManyToOne(() => Order, (order) => order.orderBatches)
	order!: Relation<Order>;

	@ManyToOne(() => Batch, (batch) => batch.orderBatches)
	batch!: Relation<Batch>;

	@Column({
		type: 'enum',
		enum: OrderStatus
	})
	status!: OrderStatus;

	@Column({
		type: 'datetime'
	})
	datetime?: Date;
}
