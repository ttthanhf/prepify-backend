import {
	Entity,
	ManyToOne,
	PrimaryKey,
	Property,
	TinyIntType
} from '@mikro-orm/core';
import { Order } from './order.entity';
import { MealKit } from './meal-kit.entity';

@Entity({ tableName: 'order_detail' })
export class OrderDetail {
	@PrimaryKey()
	@Property({ autoincrement: true, primary: true })
	id!: number;

	@Property()
	quantity!: number;

	@Property({ type: TinyIntType, columnType: 'tinyint(1)' })
	isCart!: boolean;

	@Property()
	price!: number;

	@ManyToOne()
	order!: Order;

	@ManyToOne()
	mealKit!: MealKit;
}
