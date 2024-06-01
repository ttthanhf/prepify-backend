import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import { Category } from '~models/entities/category.entity';
import { FilterQuery } from '@mikro-orm/core';
import categoryRepository from '~repositories/category,repository';

class CategoryService {
	async getCategoryHandle(req: FastifyRequest, res: FastifyResponse) {
		const query = req.query as FilterQuery<Category>;

		let category: any;
		if (query) {
			try {
				category = await categoryRepository.findCategory(
					JSON.parse(JSON.stringify(query))
				);
			} catch (error) {
				category = await categoryRepository.findAllCategory();
			}
		} else {
			category = await categoryRepository.findAllCategory();
		}

		const response = new ResponseModel(res);
		response.data = category;
		return response.send();
	}
}

export default new CategoryService();
