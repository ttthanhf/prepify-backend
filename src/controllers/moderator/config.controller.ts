import configService from '~services/moderator/config.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class ConfigModeratorController {
	async getAllConfig(req: FastifyRequest, res: FastifyResponse) {
		return configService.getAllConfig(req, res);
	}

	async updateConfig(req: FastifyRequest, res: FastifyResponse) {
		return configService.updateConfig(req, res);
	}
}

export default new ConfigModeratorController();
