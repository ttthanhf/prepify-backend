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
import { Rel } from '@mikro-orm/core';

@Entity({ tableName: 'customer' })
export class Customer {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@OneToOne({ entity: () => User })
	user!: Rel<User>;

	@OneToMany('CustomerIngredient', 'customer')
	customerIngredients = new Collection<CustomerIngredient>(this);

	@OneToMany('Order', 'customer')
	orders = new Collection<Order>(this);
}
