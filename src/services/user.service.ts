import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import ResponseModel from '~models/responses/response.model';
import jwtUtil from '~utils/jwt.util';
import userRepository from '~repositories/user.repository';
import headerUtil from '~utils/header.util';
import objectUtil from '~utils/object.util';

class AuthService {
	async getCurrentUser(req: FastifyRequest, res: FastifyResponse) {
		const token = headerUtil.extractAuthorization(req.headers);
		const userId = jwtUtil.verify(token).userId;
		const user = await userRepository.findOne({
			where: {
				id: userId
			},
			relations: ['area']
		});

		const response = new ResponseModel(res);
		const userResponse = objectUtil.hideProperties(user!, 'password', 'area');
		Object.assign(userResponse, { areaId: user!.area?.id });
		response.data = {
			user: userResponse
		};
		return response.send();
	}
}

export default new AuthService();
