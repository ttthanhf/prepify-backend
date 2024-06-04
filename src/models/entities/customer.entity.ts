import { User } from './user.entity';
import { CustomerIngredient } from './customer-ingredient.entity';
import { Order } from './order.entity';
import { v4 as uuidv4 } from 'uuid';
import { Entity, OneToMany, OneToOne, PrimaryColumn, Relation } from 'typeorm';

@Entity({ name: 'customer' })
export class Customer {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@OneToOne(() => User)
	user!: Relation<User>;

	@OneToMany(
		() => CustomerIngredient,
		(customerIngredient) => customerIngredient.customer
	)
	customerIngredients!: CustomerIngredient[];

	@OneToMany(() => Order, (order) => order.customer)
	orders!: Order[];
}
