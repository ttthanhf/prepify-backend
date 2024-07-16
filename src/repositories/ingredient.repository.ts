import { Ingredient } from '~models/entities/ingredient.entity';
import { BaseRepository } from './base.repository';

class IngredientRepository extends BaseRepository<Ingredient> {
	constructor() {
		super(Ingredient);
	}
}

export default new IngredientRepository();
