import { Nutrition } from '~models/entities/nutrition.entity';
import { BaseRepository } from './base.repository';

class NutritionRepository extends BaseRepository<Nutrition> {
	constructor() {
		super(Nutrition);
	}
}

export default new NutritionRepository();
