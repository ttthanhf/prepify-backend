export class MealKitCartResponse {
	id!: string;
	price!: number;
	serving!: number;
}

export class RecipeCartResponse {
	id!: string;
	name!: string;
	slug!: string;
}

export class CartItemResponse {
	id!: string;
	recipe!: RecipeCartResponse;
	mealKitSelected!: MealKitCartResponse;
	quantity!: number;
	totalPrice!: number; // quantity * mealkit.price
	image!: string;
	mealKits!: Array<MealKitCartResponse>; // get all mealkit
}
