export class GetMealKitModeratorResponse {
	id!: string;
	recipeName!: string;
	serving!: number;
	price!: number;
	image!: string;
	extraSpice?: {
		name: string;
		price: number;
		image: string;
	};
}
