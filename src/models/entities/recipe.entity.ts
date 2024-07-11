import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
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

	@Column()
	slug!: string;

	@Column({
		type: 'datetime',
		default: new Date()
	})
	createdAt: Date = new Date();

	@Column()
	videoUrl!: string;

	@ManyToOne(() => Category, (category) => category.id)
	category!: Relation<Category>;

	@ManyToMany(() => FoodStyle, (foodStyle) => foodStyle.recipes)
	@JoinTable({
		name: 'recipe_style'
	})
	foodStyles!: FoodStyle[];

	@OneToMany(() => MealKit, (mealKit) => mealKit.recipe)
	mealKits!: MealKit[];

	@Column({
		type: 'float',
		default: 0
	})
	rating: number = 0;

	@Column({
		default: 0
	})
	totalFeedback: number = 0;

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
