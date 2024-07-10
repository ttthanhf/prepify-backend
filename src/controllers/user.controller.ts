import userService from '~services/user.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class UserController {
	async getMe(req: FastifyRequest, res: FastifyResponse) {
		return userService.getCurrentUser(req, res);
	}

	async updateMe(req: FastifyRequest, res: FastifyResponse) {
		return userService.updateUser(req, res);
	}
}

export default new UserController();
