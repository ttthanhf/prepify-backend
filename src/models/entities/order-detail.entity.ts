import { Order } from './order.entity';
import { MealKit } from './meal-kit.entity';
import { v4 as uuidv4 } from 'uuid';
import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';

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

	@ManyToOne(() => Order, (order) => order.orderDetails)
	order!: Relation<Order>;

	@ManyToOne(() => MealKit, (mealKit) => mealKit.orderDetails)
	mealKit!: Relation<MealKit>;
}
