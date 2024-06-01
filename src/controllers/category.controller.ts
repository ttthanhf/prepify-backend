import categoryService from '~services/category.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class CategoryController {
	async getCategory(req: FastifyRequest, res: FastifyResponse) {
		return categoryService.getCategoryHandle(req, res);
	}
}

export default new CategoryController();
