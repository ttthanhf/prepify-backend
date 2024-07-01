import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import categoryModeratorService from '~services/moderator/category.service';

class CategoryModeratorController {
	async getCategory(req: FastifyRequest, res: FastifyResponse) {
		return categoryModeratorService.getCategoryHandle(req, res);
	}

	async createCategory(req: FastifyRequest, res: FastifyResponse) {
		return categoryModeratorService.createCategoryHandle(req, res);
	}

	async updateCategory(req: FastifyRequest, res: FastifyResponse) {
		return categoryModeratorService.updateCategoryHandle(req, res);
	}
}

export default new CategoryModeratorController();
