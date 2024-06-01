import {
	Collection,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	Property,
	Rel
} from '@mikro-orm/core';
import { Category } from './category.entity';
import { FoodStyle } from './food-style.entity';
import { MealKit } from './meal-kit.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'recipe' })
export class Recipe {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@Property()
	name!: string;

	@Property()
	steps!: string;

	@ManyToOne({ entity: () => Category })
	category!: Rel<Category>;

	@ManyToMany({ entity: () => FoodStyle, inversedBy: 'recipes' })
	foodStyles = new Collection<FoodStyle>(this);

	@OneToMany('MealKit', 'recipe')
	mealKits = new Collection<MealKit>(this);

	@OneToMany('RecipeIngredient', 'recipe')
	recipeIngredients = new Collection<RecipeIngredient>(this);

	@Property()
	time!: number;

	@Property()
	level!: string;
}
