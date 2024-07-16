import { RestrictIngredient } from '~models/entities/restrict-ingredient.entity';
import { BaseRepository } from './base.repository';

class RestrictIngredientRepository extends BaseRepository<RestrictIngredient> {
	constructor() {
		super(RestrictIngredient);
	}
}

export default new RestrictIngredientRepository();
