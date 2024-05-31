import { Entity, ManyToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core';
import { Order } from './order.entity';
import { v4 as uuidv4 } from 'uuid';
import { Payment } from './payment.entity';

@Entity({ tableName: 'order_payment' })
export class OrderPayment {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@ManyToOne({ entity: () => Order })
	order!: Rel<Order>;

	@ManyToOne({ entity: () => Payment })
	payment!: Rel<Payment>;

	@Property()
	totalPrice!: number;

	@Property()
	transactionId?: string;
}
