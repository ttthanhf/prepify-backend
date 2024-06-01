import { FilterQuery } from '@mikro-orm/core';
import { FoodStyle } from '~models/entities/food-style.entity';
import mikroUtil from '~utils/mikro.util';

class FoodStyleRepository {
	async findFoodStyle(field: FilterQuery<FoodStyle>) {
		return await mikroUtil.em.find(FoodStyle, field);
	}

	async findAllFoodStyle() {
		return await mikroUtil.em.findAll(FoodStyle);
	}
}

export default new FoodStyleRepository();
