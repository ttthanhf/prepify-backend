import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	Relation
} from 'typeorm';
import { Nutrition } from './nutrition.entity';
import { Recipe } from './recipe.entity';
import { Unit } from './unit.entity';

@Entity({ name: 'recipe_nutrition' })
export class RecipeNutrition {
	@PrimaryColumn()
	recipe_id!: string;

	@PrimaryColumn()
	nutrition_id!: string;

	@ManyToOne(() => Recipe, (recipe) => recipe.recipeNutritions)
	@JoinColumn({ name: 'recipe_id' })
	recipe!: Relation<Recipe>;

	@ManyToOne(() => Nutrition, (nutrition) => nutrition.recipeNutritions)
	@JoinColumn({ name: 'nutrition_id' })
	nutrition!: Nutrition;

	@Column()
	amount!: number;

	@ManyToOne(() => Unit, (unit) => unit.recipeNutritions)
	unit!: Relation<Unit>;
}
