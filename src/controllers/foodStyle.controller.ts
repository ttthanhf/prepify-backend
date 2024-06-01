import foodStyleService from '~services/foodStyle.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class FoodStyleController {
	async getFoodStyle(req: FastifyRequest, res: FastifyResponse) {
		return foodStyleService.getFoodStyleHandle(req, res);
	}
}

export default new FoodStyleController();
