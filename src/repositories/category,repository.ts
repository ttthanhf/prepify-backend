import { FilterQuery } from '@mikro-orm/core';
import { Category } from '~models/entities/category.entity';
import mikroUtil from '~utils/mikro.util';

class CategoryRepository {
	async findCategory(field: FilterQuery<Category>) {
		return await mikroUtil.em.find(Category, field);
	}

	async findAllCategory() {
		return await mikroUtil.em.findAll(Category);
	}
}

export default new CategoryRepository();
