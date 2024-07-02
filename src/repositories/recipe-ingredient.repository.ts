import { RecipeIngredient } from '~models/entities/recipe-ingredient.entity';
import { BaseRepository } from './base.repository';

class RecipeIngredientRepository extends BaseRepository<RecipeIngredient> {
	constructor() {
		super(RecipeIngredient);
	}
}

export default new RecipeIngredientRepository();
