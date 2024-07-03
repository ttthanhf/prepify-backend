import { v4 as uuidv4 } from 'uuid';
import { RecipeNutrition } from './recipe-nutrition.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { UnitType } from '~constants/unittype.constant';

@Entity({ name: 'unit' })
export class Unit {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	name!: string;

	@Column({
		type: 'datetime',
		default: new Date()
	})
	createdAt: Date = new Date();

	@OneToMany(() => RecipeNutrition, (recipeNutrition) => recipeNutrition.unit)
	recipeNutritions!: RecipeNutrition[];

	@OneToMany(
		() => RecipeIngredient,
		(recipeIngredient) => recipeIngredient.unit
	)
	recipeIngredients!: RecipeIngredient[];

	@OneToMany(() => Ingredient, (ingredient) => ingredient.unit)
	ingredients!: Ingredient[];

	@Column({ type: 'enum', enum: UnitType })
	type!: UnitType;
}
