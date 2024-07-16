import { BaseRepository } from './base.repository';
import { RecipeNutrition } from '~models/entities/recipe-nutrition.entity';

class RecipeNutritionRepository extends BaseRepository<RecipeNutrition> {
	constructor() {
		super(RecipeNutrition);
	}
}

export default new RecipeNutritionRepository();
