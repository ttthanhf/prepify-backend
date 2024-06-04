import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { Nutrition } from './nutrition.entity';
import { Recipe } from './recipe.entity';
import { Unit } from './unit.entity';

@Entity({ name: 'recipe_nutrition' })
export class RecipeNutrition {
	@ManyToOne(() => Recipe, (recipe) => recipe.recipeNutritions)
	recipe!: Relation<Recipe>;

	@ManyToOne(() => Nutrition, (nutrition) => nutrition.recipeNutritions)
	nutrition!: Relation<Nutrition>;

	@Column()
	amount!: number;

	@ManyToOne(() => Unit, (unit) => unit.recipeNutritions)
	unit!: Relation<Unit>;
}
