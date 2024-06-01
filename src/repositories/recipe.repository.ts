import { Recipe } from '~models/entities/recipe.entity';
import mikroUtil from '~utils/mikro.util';

class RecipeRepository {
	async createNewRecipe(recipe: Recipe) {
		return await mikroUtil.em.persistAndFlush(recipe);
	}
}

export default new RecipeRepository();
