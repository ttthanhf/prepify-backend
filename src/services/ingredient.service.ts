import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import { FilterQuery } from '@mikro-orm/core';
import ingredientRepository from '~repositories/ingredient.repository';
import { Ingredient } from '~models/entities/ingredient.entity';

class IngredientService {
	async getIngredientHandle(req: FastifyRequest, res: FastifyResponse) {
		const query = req.query as FilterQuery<Ingredient>;

		let ingredient: any;
		if (query) {
			try {
				ingredient = await ingredientRepository.findIngredient(
					JSON.parse(JSON.stringify(query))
				);
			} catch (error) {
				ingredient = await ingredientRepository.findAllIngredient();
			}
		} else {
			ingredient = await ingredientRepository.findAllIngredient();
		}

		const response = new ResponseModel(res);
		response.data = ingredient;
		return response.send();
	}
}

export default new IngredientService();
