import {
	Collection,
	Entity,
	ManyToMany,
	PrimaryKey,
	Property
} from '@mikro-orm/core';
import { Recipe } from './recipe.entity';

@Entity({ tableName: 'food_style' })
export class FoodStyle {
	@PrimaryKey()
	@Property({ autoincrement: true, primary: true })
	id!: number;

	@Property()
	name!: string;

	@Property()
	type!: string;

	@ManyToMany({ mappedBy: 'foodStyles' })
	recipes = new Collection<Recipe>(this);
}
