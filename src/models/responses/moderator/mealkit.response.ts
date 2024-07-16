export class GetMealKitModeratorResponse {
	id!: string;
	recipeName!: string;
	recipeId!: string;
	serving!: number;
	price!: number;
	image!: string;
	status!: string;
	extraSpice?: {
		name: string;
		price: number;
		image: string;
	};
}
