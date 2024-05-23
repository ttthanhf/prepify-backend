import {
	Collection,
	Entity,
	OneToMany,
	PrimaryKey,
	Property
} from '@mikro-orm/core';
import { RecipeIngredient } from './recipe-ingredient.entity';

@Entity({ tableName: 'ingredient' })
export class Ingredient {
	@PrimaryKey()
	@Property({ autoincrement: true, primary: true })
	id!: number;

	@Property()
	name!: string;

	@Property()
	category!: string;

	@Property()
	portionSize!: number;

	@Property()
	calories!: number;

	@Property()
	carbohydrate!: number;

	@Property()
	dietaryFiber!: number;

	@Property()
	protein!: number;

	@Property()
	fat!: number;

	@Property()
	sodium!: number;

	@Property()
	sugar!: number;

	@Property()
	price!: number;

	@Property()
	description!: string;

	@OneToMany({ mappedBy: 'ingredient' })
	recipeIngredients = new Collection<RecipeIngredient>(this);
}
