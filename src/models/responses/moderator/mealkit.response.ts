export class GetMealKitModeratorResponse {
	id!: string;
	recipeName!: string;
	serving!: number;
	price!: number;
	extraSpice?: {
		name: string;
		price: number;
	};
}
