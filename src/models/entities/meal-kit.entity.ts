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

@Entity({ tableName: 'meal_kit' })
export class MealKit {
	@PrimaryKey()
	@Property({ autoincrement: true, primary: true })
	id!: number;

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
