export class RecipeShopReponseModel {
	id!: string;
	name!: string;
	slug!: string;
	foodStyles!: string;
	mainImage!: string;
	subImage!: string;
	level!: string;
	time!: number;
	price!: number;
	star: number = 0;
	sold: number = 0;
}
