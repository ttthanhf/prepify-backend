import {
	Collection,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	Property,
	Rel
} from '@mikro-orm/core';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { v4 as uuidv4 } from 'uuid';
import { CustomerIngredient } from './customer-ingredient.entity';
import { Unit } from './unit.entity';

@Entity({ tableName: 'ingredient' })
export class Ingredient {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

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
	price!: number;

	@Property()
	description?: string;

	@OneToMany('RecipeIngredient', 'ingredient')
	recipeIngredients = new Collection<RecipeIngredient>(this);

	@OneToMany('CustomerIngredient', 'ingredient')
	customerIngredients = new Collection<CustomerIngredient>(this);

	@ManyToOne({ entity: () => Unit })
	unit!: Rel<Unit>;
}
