import { FilterQuery } from '@mikro-orm/core';
import { Ingredient } from '~models/entities/ingredient.entity';
import mikroUtil from '~utils/mikro.util';

class IngredientRepository {
	async findIngredient(field: FilterQuery<Ingredient>) {
		return await mikroUtil.em.find(Ingredient, field);
	}

	async findAllIngredient() {
		return await mikroUtil.em.findAll(Ingredient);
	}
}

export default new IngredientRepository();
