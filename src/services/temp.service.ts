import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import configRepository from '~repositories/config.repository';
import { ShippingDate } from '~models/responses/checkout.response.model';
import { LevelCook } from '~constants/levelcook.constant';

class TempService {
	async getShippingDateHandle(req: FastifyRequest, res: FastifyResponse) {
		const currentDate = new Date();
		const configs = await configRepository.findAll();

		const instantDate = new ShippingDate();
		const instantCurrentDate = new Date();

		let workEndHour = 0;
		let maxShippingHour = 0;
		configs.forEach((config) => {
			if (config.type == 'workEndHour') {
				workEndHour = config.value;
			} else if (config.type == 'maxShippingHour') {
				maxShippingHour = config.value;
			}
		});

		if (workEndHour - currentDate.getHours() <= maxShippingHour) {
			instantCurrentDate.setDate(currentDate.getDate() + 1);
		}
		instantDate.day = instantCurrentDate.getDate();
		instantDate.month = instantCurrentDate.getMonth() + 1;
		instantDate.year = instantCurrentDate.getFullYear();

		const standardCurrentDate = new Date();
		standardCurrentDate.setDate(currentDate.getDate() + 1);
		const standardDate = new ShippingDate();
		standardDate.day = standardCurrentDate.getDate();
		standardDate.month = standardCurrentDate.getMonth() + 1;
		standardDate.year = standardCurrentDate.getFullYear();

		const response = new ResponseModel(res);
		response.data = {
			instantDate,
			standardDate
		};
		return response.send();
	}

	async getCookingLevelHandle(req: FastifyRequest, res: FastifyResponse) {
		const response = new ResponseModel(res);
		response.data = LevelCook;
		return response.send();
	}
}

export default new TempService();
