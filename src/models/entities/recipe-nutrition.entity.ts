import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { Nutrition } from './nutrition.entity';
import { Recipe } from './recipe.entity';
import { Unit } from './unit.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'recipe_nutrition' })
export class RecipeNutrition {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@ManyToOne(() => Recipe, (recipe) => recipe.recipeNutritions)
	recipe!: Relation<Recipe>;

	@ManyToOne(() => Nutrition, (nutrition) => nutrition.recipeNutritions)
	nutrition!: Nutrition;

	@Column({
		type: 'float'
	})
	amount!: number;

	@ManyToOne(() => Unit, (unit) => unit.recipeNutritions)
	unit!: Relation<Unit>;
}
