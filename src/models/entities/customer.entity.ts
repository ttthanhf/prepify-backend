import {
	Collection,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryKey
} from '@mikro-orm/core';
import { User } from './user.entity';
import { CustomerIngredient } from './customer-ingredient.entity';
import { Order } from './order.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'customer' })
export class Customer {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@OneToOne()
	user!: User;

	@OneToMany({ mappedBy: 'customer' })
	customerIngredients = new Collection<CustomerIngredient>(this);

	@OneToMany({ mappedBy: 'order' })
	orders = new Collection<Order>(this);
}
