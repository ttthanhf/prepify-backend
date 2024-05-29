import { AuthorizationTokenConfig } from 'simple-oauth2';
import authService from '~services/auth.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class AuthController {
	async login(req: FastifyRequest, res: FastifyResponse) {
		return authService.loginHandle(req, res);
	}
	async register(req: FastifyRequest, res: FastifyResponse) {
		return authService.registerHandle(req, res);
	}
	async getUrlGoogle(req: FastifyRequest, res: FastifyResponse) {
		return authService.getUrlGoogle(req, res);
	}
	async loginWithGoogle(
		req: FastifyRequest<{ Querystring: AuthorizationTokenConfig }>,
		res: FastifyResponse
	) {
		return authService.loginWithGoogleHandle(req, res);
	}
	async forgotPassword(req: FastifyRequest, res: FastifyResponse) {
		return authService.forgotPasswordHandle(req, res);
	}
	async verifyForgotPassword(req: FastifyRequest, res: FastifyResponse) {
		return authService.verifyForgotPasswordHandle(req, res);
	}
	async resetPassword(req: FastifyRequest, res: FastifyResponse) {
		return authService.resetPasswordHandle(req, res);
	}
}

export default new AuthController();
