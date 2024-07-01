export class RecipeModeratorResponseModel {
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
