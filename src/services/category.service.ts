import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import categoryRepository from '~repositories/category,repository';

class CategoryService {
	async getCategoryHandle(req: FastifyRequest, res: FastifyResponse) {
		const category = await categoryRepository.findAll();

		const response = new ResponseModel(res);
		response.data = category;
		return response.send();
	}
}

export default new CategoryService();
