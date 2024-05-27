import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import jwtUtil from '~utils/jwt.util';
import userRepository from '~repositories/user.repository';
import headerUtil from '~utils/header.util';

class AuthService {
	async getCurrentUser(req: FastifyRequest, res: FastifyResponse) {
		const token = headerUtil.extractAuthorization(req.headers);

		const userId = jwtUtil.verify(token).userId;
		const user = await userRepository.findOneUser({
			id: userId
		});

		const response = new ResponseModel(res);
		response.data = {
			user
		};
		return response.send();
	}
}

export default new AuthService();
