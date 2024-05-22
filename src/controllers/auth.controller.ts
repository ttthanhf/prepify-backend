import { AuthorizationTokenConfig } from 'simple-oauth2';
import authService from '../services/auth.service';
import { FastifyRequest, FastifyResponse } from '../types/fastify.type';

class AuthController {
	async login(req: FastifyRequest, res: FastifyResponse) {
		return authService.loginHandle(req, res);
	}
	async register(req: FastifyRequest, res: FastifyResponse) {
		return authService.registerHandle(req, res);
	}
	async loginWithGoogle(req: FastifyRequest, res: FastifyResponse) {
		return authService.loginWithGoogleHandle(req, res);
	}
	async loginWithGoogleCallback(
		req: FastifyRequest<{ Querystring: AuthorizationTokenConfig }>,
		res: FastifyResponse
	) {
		return authService.loginWithGoogleCallbackHandle(req, res);
	}
}

export default new AuthController();
