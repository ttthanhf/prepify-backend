import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { Ingredient } from './ingredient.entity';

@Entity({ tableName: 'recipe_ingredient' })
export class RecipeIngredient {
	@PrimaryKey()
	@Property({ autoincrement: true, primary: true })
	id!: number;

	@ManyToOne()
	recipe!: Recipe;

	@ManyToOne()
	ingredient!: Ingredient;

	@Property()
	amount!: number;
}
