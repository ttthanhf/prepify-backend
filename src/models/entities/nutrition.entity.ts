import { v4 as uuidv4 } from 'uuid';
import { RecipeNutrition } from './recipe-nutrition.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'nutrition' })
export class Nutrition {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	name!: string;

	@OneToMany(
		() => RecipeNutrition,
		(recipeNutrition) => recipeNutrition.nutrition
	)
	recipeNutritions!: RecipeNutrition[];
}
