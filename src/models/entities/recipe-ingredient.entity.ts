import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { Ingredient } from './ingredient.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'recipe_ingredient' })
export class RecipeIngredient {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@ManyToOne()
	recipe!: Recipe;

	@ManyToOne()
	ingredient!: Ingredient;

	@Property()
	amount!: number;
}
