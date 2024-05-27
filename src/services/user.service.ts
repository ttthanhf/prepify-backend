import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import jwtUtil from '~utils/jwt.util';
import userRepository from '~repositories/user.repository';
import headerUtil from '@/utils/header.util';

class AuthService {
	async getCurrentUser(req: FastifyRequest, res: FastifyResponse) {
		const token = headerUtil.extractAuthorization(req.headers);

		const user_id = jwtUtil.verify(token).user_id;
		const user = await userRepository.findOneUser({
			id: user_id
		});

		const reponse = new ResponseModel(res);
		reponse.data = {
			user
		};
		return reponse.send();
	}
}

export default new AuthService();
