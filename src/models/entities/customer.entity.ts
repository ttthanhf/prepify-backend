import { User } from './user.entity';
import { RestrictIngredient } from './restrict-ingredient.entity';
import { Order } from './order.entity';
import { v4 as uuidv4 } from 'uuid';
import {
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	Relation
} from 'typeorm';
import { OrderDetail } from './order-detail.entity';

@Entity({ name: 'customer' })
export class Customer {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@OneToOne(() => User, (user) => user.customer)
	@JoinColumn()
	user!: Relation<User>;

	@OneToMany(
		() => RestrictIngredient,
		(restrictIngredient) => restrictIngredient.customer
	)
	restrictIngredients!: RestrictIngredient[];

	@OneToMany(() => Order, (order) => order.customer)
	orders!: Order[];

	@OneToMany(() => OrderDetail, (orderDetail) => orderDetail.customer)
	orderDetails!: OrderDetail[];
}
