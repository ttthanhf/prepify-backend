import { FastifyRequest } from 'fastify';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import ResponseModel from '~models/responses/response.model';
import { ConfigUpdateRequest } from '~models/schemas/moderator/config.schemas.model';
import configRepository from '~repositories/config.repository';
import { FastifyResponse } from '~types/fastify.type';

class ConfigModeratorService {
	async getAllConfig(req: FastifyRequest, res: FastifyResponse) {
		const config = await configRepository.findAll();
		const response = new ResponseModel(res);
		response.data = config;
		return response.send();
	}

	async updateConfig(req: FastifyRequest, res: FastifyResponse) {
		const { id }: any = req.params;
		const query: ConfigUpdateRequest = req.body as ConfigUpdateRequest;

		const response = new ResponseModel(res);
		const config = await configRepository.findOneBy({
			id
		});
		if (!config) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}
		config.value = query.value;
		await configRepository.update(config);
		return response.send();
	}
}
export default new ConfigModeratorService();
