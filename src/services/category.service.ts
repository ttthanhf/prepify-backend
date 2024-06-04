import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import categoryRepository from '~repositories/category,repository';

class CategoryService {
	async getCategoryHandle(req: FastifyRequest, res: FastifyResponse) {
		const query = req.query;

		let category: any;
		if (query) {
			try {
				category = await categoryRepository.findBy(
					JSON.parse(JSON.stringify(query))
				);
			} catch (error) {
				category = await categoryRepository.findAll();
			}
		} else {
			category = await categoryRepository.findAll();
		}

		const response = new ResponseModel(res);
		response.data = category;
		return response.send();
	}
}

export default new CategoryService();
