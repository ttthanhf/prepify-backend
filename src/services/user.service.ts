import { FastifyRequest, FastifyResponse } from '../types/fastify.type';
import cookieUtil from '../utils/cookie.util';
import ResponseModel from '../models/responses/response.model';
import jwtUtil from '../utils/jwt.util';
import userRepository from '../repositories/user.repository';

class AuthService {
	async getCurrentUser(req: FastifyRequest, res: FastifyResponse) {
		const cookies = cookieUtil.extract(req.headers);
		const access_token = cookies.access_token;

		const user_id = jwtUtil.verify(access_token).user_id;
		const user = await userRepository.findOneUser({
			id: user_id
		});

		const reponse = new ResponseModel(res);
		reponse.data = {
			user
		};
		reponse.send();
	}
}

export default new AuthService();
