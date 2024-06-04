import { Recipe } from './recipe.entity';
import { Ingredient } from './ingredient.entity';
import { v4 as uuidv4 } from 'uuid';
import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';

@Entity({ name: 'recipe_ingredient' })
export class RecipeIngredient {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients)
	recipe!: Relation<Recipe>;

	@ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeIngredients)
	ingredient!: Relation<Ingredient>;

	@Column()
	amount!: number;
}
