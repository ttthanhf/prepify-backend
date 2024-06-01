import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import { FilterQuery } from '@mikro-orm/core';
import foodStyleRepository from '~repositories/foodStyle.repository';
import { FoodStyle } from '~models/entities/food-style.entity';

class FoodStyleService {
	async getFoodStyleHandle(req: FastifyRequest, res: FastifyResponse) {
		const query = req.query as FilterQuery<FoodStyle>;

		let foodStyle: any;
		if (query) {
			try {
				foodStyle = await foodStyleRepository.findFoodStyle(
					JSON.parse(JSON.stringify(query))
				);
			} catch (error) {
				foodStyle = await foodStyleRepository.findAllFoodStyle();
			}
		} else {
			foodStyle = await foodStyleRepository.findAllFoodStyle();
		}

		const response = new ResponseModel(res);
		response.data = foodStyle;
		return response.send();
	}
}

export default new FoodStyleService();
