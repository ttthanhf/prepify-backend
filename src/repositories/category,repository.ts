import { Category } from '~models/entities/category.entity';
import { BaseRepository } from './base.repository';

class CategoryRepository extends BaseRepository<Category> {
	constructor() {
		super(Category);
	}
}

export default new CategoryRepository();
