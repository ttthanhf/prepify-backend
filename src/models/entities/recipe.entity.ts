import {
	Collection,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	Property
} from '@mikro-orm/core';
import { Category } from './category.entity';
import { FoodStyle } from './food-style.entity';
import { MealKit } from './meal-kit.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';

@Entity({ tableName: 'recipe' })
export class Recipe {
	@PrimaryKey()
	@Property({ autoincrement: true, primary: true })
	id!: number;

	@Property()
	name!: string;

	@Property()
	steps!: string;

	@ManyToOne()
	category!: Category;

	@ManyToMany()
	foodStyles = new Collection<FoodStyle>(this);

	@OneToMany({ mappedBy: 'recipe' })
	mealKits = new Collection<MealKit>(this);

	@OneToMany({ mappedBy: 'recipe' })
	recipeIngredients = new Collection<RecipeIngredient>(this);
}
