import { LevelCook } from '~constants/levelcook.constant';
import { UnitType } from '~constants/unittype.constant';

export class RecipeShopResponseModel {
	id!: string;
	name!: string;
	slug!: string;
	foodStyle!: string;
	mainImage!: string;
	subImage!: string;
	level!: string;
	time!: number;
	price!: number;
	star: number = 0;
	sold: number = 0;
}

export class CategoryRecipeDetailShopResponse {
	id!: string;
	name!: string;
}

export class UnitRecipeDetailShopResponse {
	id!: string;
	name!: string;
	type!: UnitType;
}

export class ItemRecipeDetailShopResponse {
	id!: string;
	slug!: string;
	name!: string;
	star!: number;
	sold!: number;
	totalFeedback?: number;
	images!: Array<String>;
	level!: LevelCook;
	time!: number;
	steps!: string;
	videoUrl!: string;
	category!: CategoryRecipeDetailShopResponse;
	mealKits!: {
		id: string;
		price: number;
		serving: number;
		extraSpice: {
			id: string;
			name: string;
			image: string;
			price: number;
		};
	};
}

export class FoodStylesRecipeDetailShopResponse {
	id!: string;
	type!: string;
	slug!: string;
	title!: string;
	name!: string;
}

export class NutritionRecipeDetailShopResponse {
	id!: string;
	name!: string;
	units!: UnitRecipeDetailShopResponse;
	amount!: number;
}

export class IngredientsRecipeDetailShopResponse {
	id!: string;
	name!: string;
	category!: string;
	price!: number;
	description!: string;
	unit!: UnitRecipeDetailShopResponse;
	imageURL!: string;
	amount!: number;
}

export class RecipeDetailShopResponse {
	recipe!: ItemRecipeDetailShopResponse;
	foodStyles!: FoodStylesRecipeDetailShopResponse[];
	ingredients!: IngredientsRecipeDetailShopResponse[];
	nutritions!: NutritionRecipeDetailShopResponse[];
}
