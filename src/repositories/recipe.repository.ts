import { FilterQuery } from '@mikro-orm/core';
import { Recipe } from '~models/entities/recipe.entity';
import mikroUtil from '~utils/mikro.util';

class RecipeRepository {
	async createNewRecipe(recipe: Recipe) {
		return await mikroUtil.em.persistAndFlush(recipe);
	}

	async updateRecipe(recipe: Recipe) {
		this.createNewRecipe(recipe);
	}

	async findOneRecipe(field: FilterQuery<Recipe>) {
		return await mikroUtil.em.findOne(Recipe, field);
	}

	async findRecipe(field: FilterQuery<Recipe>) {
		return await mikroUtil.em.find(Recipe, field);
	}

	async findAllRecipe() {
		return await mikroUtil.em.findAll(Recipe);
	}
}

export default new RecipeRepository();
