import authService from '../services/auth.service';
import { FastifyRequest, FastifyResponse } from '../types/fastify.type';

class AuthController {
	async login(req: FastifyRequest, res: FastifyResponse) {
		return authService.loginHandle(req, res);
	}
	async register(req: FastifyRequest, res: FastifyResponse) {
		return authService.registerHandle(req, res);
	}
}

export default new AuthController();
