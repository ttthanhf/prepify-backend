import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import foodStyleRepository from '~repositories/foodStyle.repository';

class FoodStyleService {
	async getFoodStyleHandle(req: FastifyRequest, res: FastifyResponse) {
		const query = req.query;

		let foodStyle: any;
		if (query) {
			try {
				foodStyle = await foodStyleRepository.findBy(
					JSON.parse(JSON.stringify(query))
				);
			} catch (error) {
				foodStyle = await foodStyleRepository.findAll();
			}
		} else {
			foodStyle = await foodStyleRepository.findAll();
		}

		const response = new ResponseModel(res);
		response.data = foodStyle;
		return response.send();
	}
}

export default new FoodStyleService();
