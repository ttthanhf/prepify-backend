import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import foodStyleRepository from '~repositories/foodStyle.repository';

class FoodStyleService {
	async getFoodStyleHandle(req: FastifyRequest, res: FastifyResponse) {
		const foodStyles = await foodStyleRepository.findAll();

		const results = [];
		for (const item of foodStyles) {
			const { type, id, name, slug, title } = item;
			const dataItem = { id, name, slug };

			let types = results.find((group) => group.type === type);
			if (types) {
				types.data.push(dataItem);
			} else {
				results.push({ type, title, data: [dataItem] });
			}
		}

		const response = new ResponseModel(res);
		response.data = results;
		return response.send();
	}
}

export default new FoodStyleService();
