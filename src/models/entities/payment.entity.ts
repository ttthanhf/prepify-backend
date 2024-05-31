import {
	Collection,
	Entity,
	OneToMany,
	PrimaryKey,
	Property
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { OrderPayment } from './order-payment.entity';

@Entity({ tableName: 'payment' })
export class Payment {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@Property()
	name!: string;

	@OneToMany('OrderPayment', 'payment')
	orderPayments = new Collection<OrderPayment>(this);
}
