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
import { v4 as uuidv4 } from 'uuid';
import { OrderStatus } from '~constants/orderstatus.constant';
import { Area } from './area.entity';
import { Customer } from './customer.entity';
import { OrderBatch } from './order-batch.entity';
import { OrderDetail } from './order-detail.entity';
import { OrderPayment } from './order-payment.entity';

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

	@Enum(() => OrderStatus)
	status!: OrderStatus;

	@ManyToOne({ entity: () => Customer })
	customer!: Rel<Customer>;

	@OneToMany('OrderDetail', 'order')
	orderDetails = new Collection<OrderDetail>(this);

	@OneToMany('OrderBatch', 'order')
	orderBatches = new Collection<OrderBatch>(this);

	@OneToMany('OrderPayment', 'order')
	orderPayments = new Collection<OrderPayment>(this);

	@ManyToOne({ entity: () => Area })
	area!: Rel<Area>;
}
