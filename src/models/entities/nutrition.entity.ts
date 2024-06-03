import {
	Collection,
	Entity,
	OneToMany,
	PrimaryKey,
	Property
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { RecipeNutrition } from './recipe-nutrition.entity';

@Entity({ tableName: 'nutrition' })
export class Nutrition {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@Property()
	name!: string;

	@OneToMany('RecipeNutrition', 'nutrition')
	recipeNutritions = new Collection<RecipeNutrition>(this);
}
