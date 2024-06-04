import {
	Column,
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	Relation
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Category } from './category.entity';
import { FoodStyle } from './food-style.entity';
import { MealKit } from './meal-kit.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { RecipeNutrition } from './recipe-nutrition.entity';

@Entity({ name: 'recipe' })
export class Recipe {
	@PrimaryColumn()
	id: string = uuidv4();

	@Column()
	name!: string;

	@Column()
	steps!: string;

	@ManyToOne(() => Category, (category) => category.id)
	category!: Relation<Category>;

	@ManyToMany(() => FoodStyle, (foodStyle) => foodStyle.recipes)
	foodStyles!: FoodStyle[];

	@OneToMany(() => MealKit, (mealKit) => mealKit.recipe)
	mealKits!: MealKit[];

	@OneToMany(
		() => RecipeIngredient,
		(recipeIngredient) => recipeIngredient.recipe
	)
	@JoinColumn()
	recipeIngredients!: RecipeIngredient[];

	@OneToMany(() => RecipeNutrition, (recipeNutrition) => recipeNutrition.recipe)
	@JoinColumn()
	recipeNutritions!: RecipeNutrition[];

	@Column()
	time!: number;

	@Column()
	level!: string;

	images: Array<string> = [];
}
