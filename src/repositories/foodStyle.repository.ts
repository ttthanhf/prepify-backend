import { FoodStyle } from '~models/entities/food-style.entity';
import { BaseRepository } from './base.repository';

class FoodStyleRepository extends BaseRepository<FoodStyle> {
	constructor() {
		super(FoodStyle);
	}
}

export default new FoodStyleRepository();
