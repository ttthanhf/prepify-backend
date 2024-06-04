import {
	Column,
	Entity,
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

@Entity({ name: 'recipe' })
export class Recipe {
	@PrimaryColumn()
	id: string = uuidv4();

	@Column()
	name!: string;

	@Column()
	steps!: string;

	@ManyToOne(() => Category, (category) => category.id, { eager: true })
	category!: Relation<Category>;

	@ManyToMany(() => FoodStyle, (foodStyle) => foodStyle.recipes)
	foodStyles!: FoodStyle[];

	@OneToMany(() => MealKit, (mealKit) => mealKit.recipe)
	mealKits!: MealKit[];

	@OneToMany(
		() => RecipeIngredient,
		(recipeIngredient) => recipeIngredient.recipe
	)
	recipeIngredients!: RecipeIngredient[];

	@Column()
	time!: number;

	@Column()
	level!: string;

	images: Array<string> = [];
}
