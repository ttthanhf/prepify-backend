import {
	Collection,
	Entity,
	OneToMany,
	PrimaryKey,
	Property
} from '@mikro-orm/core';
import { Order } from './order.entity';

@Entity({ tableName: 'payment' })
export class Payment {
	@PrimaryKey()
	@Property({ autoincrement: true, primary: true })
	id!: number;

	@Property()
	name!: string;

	@OneToMany({ mappedBy: 'payment' })
	orderPayments = new Collection<Order>(this);
}
