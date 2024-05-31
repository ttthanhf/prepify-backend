import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { Ingredient } from './ingredient.entity';
import { Recipe } from './recipe.entity';
import { Unit } from './unit.entity';

@Entity({ tableName: 'recipe_ingredient' })
export class RecipeIngredient {
	@ManyToOne({ entity: () => Recipe, primary: true })
	recipe!: Rel<Recipe>;

	@ManyToOne({ entity: () => Ingredient, primary: true })
	ingredient!: Rel<Ingredient>;

	@ManyToOne({ entity: () => Unit })
	unit!: Rel<Unit>;

	@Property()
	amount!: number;
}
