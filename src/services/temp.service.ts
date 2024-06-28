import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import areaRepository from '~repositories/area.repository';
import configRepository from '~repositories/config.repository';
import { ShippingDate } from '~models/responses/checkout.response.model';
import { LevelCook } from '~constants/levelcook.constant';
import { OrderStatus } from '~constants/orderstatus.constant';
import paymentRepository from '~repositories/payment.repository';

class TempService {
	async getAreaHandle(req: FastifyRequest, res: FastifyResponse) {
		const area = await areaRepository.findAll();
		const response = new ResponseModel(res);
		response.data = area;
		return response.send();
	}

	async getShippingDateHandle(req: FastifyRequest, res: FastifyResponse) {
		const currentDate = new Date();
		const config = await configRepository.find({
			select: {
				workEndHour: true,
				maxShippingHour: true
			}
		});

		const instantDate = new ShippingDate();
		const instantCurrentDate = new Date();
		if (
			config[0].workEndHour - currentDate.getHours() <=
			config[0].maxShippingHour
		) {
			instantCurrentDate.setDate(currentDate.getDate() + 1);
		}
		instantDate.day = instantCurrentDate.getDate();
		instantDate.month = instantCurrentDate.getMonth();
		instantDate.year = instantCurrentDate.getFullYear();

		const standardCurrentDate = new Date();
		standardCurrentDate.setDate(currentDate.getDate() + 1);
		const standardDate = new ShippingDate();
		standardDate.day = standardCurrentDate.getDate();
		standardDate.month = standardCurrentDate.getMonth();
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

	async getOrderStatusHandle(req: FastifyRequest, res: FastifyResponse) {
		const response = new ResponseModel(res);
		response.data = OrderStatus;
		return response.send();
	}

	async getPaymentHandle(req: FastifyRequest, res: FastifyResponse) {
		const payment = await paymentRepository.findAll();
		const response = new ResponseModel(res);
		response.data = payment;
		return response.send();
	}
}

export default new TempService();
