export class MealKitCartResponse {
	id!: string;
	price!: number;
	serving!: number;
	extraSpice!: ExtraSpiceResponse;
}

export class RecipeCartResponse {
	id!: string;
	name!: string;
	slug!: string;
}

export class ExtraSpiceResponse {
	id!: string;
	name!: string;
	image!: string;
	price!: string;
}

export class CartItemResponse {
	id!: string;
	recipe!: RecipeCartResponse;
	mealKitSelected!: MealKitCartResponse;
	quantity!: number;
	image!: string;
	mealKits!: Array<MealKitCartResponse>; // get all mealkit
	extraSpice!: ExtraSpiceResponse;
}
