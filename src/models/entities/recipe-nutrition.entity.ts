import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { Nutrition } from './nutrition.entity';
import { Recipe } from './recipe.entity';
import { Unit } from './unit.entity';

@Entity({ tableName: 'recipe_nutrition' })
export class RecipeNutrition {
	@ManyToOne({ entity: () => Recipe, primary: true })
	recipe!: Rel<Recipe>;

	@ManyToOne({ entity: () => Nutrition, primary: true })
	nutrition!: Rel<Nutrition>;

	@Property()
	amount!: number;

	@ManyToOne({ entity: () => Unit })
	unit!: Rel<Unit>;
}
