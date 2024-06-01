import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import { Category } from '~models/entities/category.entity';
import { FilterQuery } from '@mikro-orm/core';
import ingredientRepository from '~repositories/ingredient.repository';

class IngredientService {
	async getIngredientHandle(req: FastifyRequest, res: FastifyResponse) {
		const query = req.query as FilterQuery<Category>;

		let category: any;
		if (query) {
			try {
				category = await ingredientRepository.findIngredient(
					JSON.parse(JSON.stringify(query))
				);
			} catch (error) {
				category = await ingredientRepository.findAllIngredient();
			}
		} else {
			category = await ingredientRepository.findAllIngredient();
		}

		const response = new ResponseModel(res);
		response.data = category;
		return response.send();
	}
}

export default new IngredientService();
