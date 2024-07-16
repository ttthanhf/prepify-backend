import { Recipe } from '~models/entities/recipe.entity';
import { BaseRepository } from './base.repository';

class RecipeRepository extends BaseRepository<Recipe> {
	constructor() {
		super(Recipe);
	}
}

export default new RecipeRepository();
