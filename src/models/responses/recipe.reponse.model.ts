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

export class RecipeDetailShopResponse {
	id!: string;
	slug!: string;
	name!: string;
	star?: number;
	sold!: number;
	totalFeedback?: number;
	images!: Array<String>;
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
