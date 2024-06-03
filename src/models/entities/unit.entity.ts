import {
	Collection,
	Entity,
	OneToMany,
	PrimaryKey,
	Property
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { RecipeNutrition } from './recipe-nutrition.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';

@Entity({ tableName: 'unit' })
export class Unit {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@Property()
	name!: string;

	@OneToMany('RecipeNutrition', 'unit')
	recipeNutritions = new Collection<RecipeNutrition>(this);

	@OneToMany('RecipeIngredient', 'unit')
	recipeIngredients = new Collection<RecipeIngredient>(this);
}
