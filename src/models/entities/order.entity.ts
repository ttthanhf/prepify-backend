import {
	Collection,
	Entity,
	Enum,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	Property,
	Rel
} from '@mikro-orm/core';
import { Customer } from './customer.entity';
import { OrderDetail } from './order-detail.entity';
import { OrderBatch } from './order-batch.entity';
import { Payment } from './payment.entity';
import { OrderStatus } from '~constants/orderstatus.constant';
import { Area } from './area.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'order' })
export class Order {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@Property()
	address!: string;

	@Property()
	datetime!: Date;

	@Property()
	totalPrice!: number;

	@Property()
	feedback?: string;

	@Property()
	rate?: number;

	@Property()
	phone!: string;

	@Property()
	transactionId!: string; // optional in the future

	@Enum(() => OrderStatus)
	status!: OrderStatus;

	@ManyToOne({ entity: () => Customer })
	customer!: Rel<Customer>;

	@OneToMany({ mappedBy: 'order', entity: () => OrderDetail })
	orderDetails = new Collection<OrderDetail>(this);

	@OneToMany({ mappedBy: 'order', entity: () => OrderBatch })
	orderBatches = new Collection<OrderBatch>(this);

	@ManyToOne({ entity: () => Payment })
	payment!: Rel<Payment>;

	@ManyToOne({ entity: () => Area })
	area!: Rel<Area>;
}
