import { LevelCook } from '~constants/levelcook.constant';
import { MealKit } from '~models/entities/meal-kit.entity';

export class AllRecipeModeratorResponseModel {
	id!: string;
	name!: string;
	category!: {
		id: string;
		name: string;
	};
	time!: number;
	image!: string;
	level!: string;
	slug!: string;
	totalmealkit!: number;
}

export class IngredientRecipeModeratorResponseModel {
	ingredient_id!: string;
	amount!: number;
	unit_id!: string;
}

export class NutritionRecipeModeratorResponseModel {
	nutrition_id!: string;
	amount!: number;
	unit_id!: string;
}

export class RecipeModeratorResponseModel {
	name!: string;
	ingredients!: IngredientRecipeModeratorResponseModel[];
	category!: string;
	foodStyles!: Record<string, string>;
	steps!: string;
	nutrition!: NutritionRecipeModeratorResponseModel[];
	mealKits!: MealKit[];
	images!: string[];
	time!: number;
	videoUrl!: string;
	level!: LevelCook;
}
