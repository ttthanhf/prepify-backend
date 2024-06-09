import { BaseRepository } from './base.repository';
import { MealKit } from '~models/entities/meal-kit.entity';

class MealKitRepository extends BaseRepository<MealKit> {
	constructor() {
		super(MealKit);
	}
}

export default new MealKitRepository();
