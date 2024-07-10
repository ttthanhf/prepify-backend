import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	Relation
} from 'typeorm';
import { OrderStatus } from '~constants/orderstatus.constant';
import { Batch } from './batch.entity';
import { Order } from './order.entity';

@Entity({ name: 'order_batch' })
export class OrderBatch {
	@PrimaryColumn({ type: 'uuid', name: 'order_id' })
	@ManyToOne(() => Order, (order) => order.orderBatches)
	@JoinColumn({ name: 'order_id' })
	order!: Relation<Order>;

	@PrimaryColumn({ type: 'uuid', name: 'batch_id' })
	@ManyToOne(() => Batch, (batch) => batch.orderBatches)
	@JoinColumn({ name: 'batch_id' })
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
