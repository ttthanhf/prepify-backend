import { v4 as uuidv4 } from 'uuid';
import { RecipeNutrition } from './recipe-nutrition.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'unit' })
export class Unit {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	name!: string;

	@OneToMany(() => RecipeNutrition, (recipeNutrition) => recipeNutrition.unit)
	recipeNutritions!: RecipeNutrition[];

	@OneToMany(
		() => RecipeIngredient,
		(recipeIngredient) => recipeIngredient.unit
	)
	recipeIngredients!: RecipeIngredient[];
}
