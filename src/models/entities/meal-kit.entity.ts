import {
	Collection,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	Property,
	TinyIntType
} from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { OrderDetail } from './order-detail.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'meal_kit' })
export class MealKit {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@Property()
	serving!: number;

	@Property()
	price!: number;

	@Property({ type: TinyIntType, columnType: 'tinyint(1)' })
	status!: boolean;

	@ManyToOne()
	recipe!: Recipe;

	@OneToMany({ mappedBy: 'mealKit' })
	orderDetails = new Collection<OrderDetail>(this);
}
