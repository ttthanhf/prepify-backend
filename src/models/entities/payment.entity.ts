import {
	Collection,
	Entity,
	OneToMany,
	PrimaryKey,
	Property
} from '@mikro-orm/core';
import { Order } from './order.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'payment' })
export class Payment {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@Property()
	name!: string;

	@OneToMany({ mappedBy: 'payment', entity: () => Order })
	orderPayments = new Collection<Order>(this);
}
