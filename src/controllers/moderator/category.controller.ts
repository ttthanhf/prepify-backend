import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import categoryModeratorService from '~services/moderator/category.service';

class CategoryModeratorController {
	async getCategory(req: FastifyRequest, res: FastifyResponse) {
		return categoryModeratorService.getCategoryHandle(req, res);
	}
}

export default new CategoryModeratorController();
