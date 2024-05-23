import {
	Entity,
	ManyToOne,
	PrimaryKey,
	Property,
	TinyIntType
} from '@mikro-orm/core';
import { Order } from './order.entity';
import { MealKit } from './meal-kit.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'order_detail' })
export class OrderDetail {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

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
