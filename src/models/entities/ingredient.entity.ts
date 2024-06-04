import { RecipeIngredient } from './recipe-ingredient.entity';
import { v4 as uuidv4 } from 'uuid';
import { CustomerIngredient } from './customer-ingredient.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ingredient' })
export class Ingredient {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	name!: string;

	@Column()
	category!: string;

	@Column()
	portionSize!: number;

	@Column()
	calories!: number;

	@Column()
	carbohydrate!: number;

	@Column()
	dietaryFiber!: number;

	@Column()
	protein!: number;

	@Column()
	fat!: number;

	@Column()
	price!: number;

	@Column()
	description?: string;

	@OneToMany(
		() => RecipeIngredient,
		(recipeIngredient) => recipeIngredient.ingredient
	)
	recipeIngredients!: RecipeIngredient[];

	@OneToMany(
		() => CustomerIngredient,
		(customerIngredient) => customerIngredient.ingredient
	)
	customerIngredients!: CustomerIngredient[];
}
