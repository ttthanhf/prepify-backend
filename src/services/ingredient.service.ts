import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import ingredientRepository from '~repositories/ingredient.repository';
import { IngredientGetRequest } from '~models/schemas/ingredient.schemas.model';

class IngredientService {
	async getIngredientHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: IngredientGetRequest = req.query as IngredientGetRequest;

		let ingredient: any;
		if (query) {
			try {
				ingredient = await ingredientRepository.findBy(
					JSON.parse(JSON.stringify(query))
				);
			} catch (error) {
				ingredient = await ingredientRepository.findAll();
			}
		} else {
			ingredient = await ingredientRepository.findAll();
		}

		const response = new ResponseModel(res);
		response.data = ingredient;
		return response.send();
	}
}

export default new IngredientService();
