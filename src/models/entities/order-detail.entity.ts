import { Order } from './order.entity';
import { MealKit } from './meal-kit.entity';
import { v4 as uuidv4 } from 'uuid';
import {
	Column,
	Entity,
	ManyToOne,
	OneToOne,
	PrimaryColumn,
	Relation
} from 'typeorm';
import { Customer } from './customer.entity';
import { Feedback } from './feedback.entity';

@Entity({ name: 'order_detail' })
export class OrderDetail {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	quantity!: number;

	@Column({
		type: 'boolean'
	})
	isCart!: boolean;

	@Column()
	price!: number;

	@Column({
		type: 'boolean',
		default: false
	})
	has_extra_spice!: boolean;

	@ManyToOne(() => Order, (order) => order.orderDetails)
	order!: Relation<Order>;

	@ManyToOne(() => MealKit, (mealKit) => mealKit.orderDetails)
	mealKit!: Relation<MealKit>;

	@ManyToOne(() => Customer, (customer) => customer.orderDetails)
	customer!: Relation<Customer>;

	@OneToOne(() => Feedback, (feedback) => feedback.orderDetail)
	feedback!: Relation<Feedback>;
}
