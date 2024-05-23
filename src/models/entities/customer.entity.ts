import {
	Collection,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryKey,
	Property
} from '@mikro-orm/core';
import { User } from './user.entity';
import { CustomerIngredient } from './customer-ingredient.entity';
import { Order } from './order.entity';

@Entity({ tableName: 'customer' })
export class Customer {
	@PrimaryKey()
	@Property({ autoincrement: true, primary: true })
	id!: number;

	@OneToOne()
	user!: User;

	@OneToMany({ mappedBy: 'customer' })
	customerIngredients = new Collection<CustomerIngredient>(this);

	@OneToMany({ mappedBy: 'order' })
	orders = new Collection<Order>(this);
}
