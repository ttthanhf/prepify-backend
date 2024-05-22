import { FastifyRequest, FastifyResponse } from '../types/fastify.type';
import { User } from '../models/entities/User.entity';
import {
	LoginRequest,
	RegisterRequest
} from '../models/requests/auth.request.model';
import bcryptUtil from '../utils/bcrypt.util';
import ResponseModel from '../models/responses/response.model';
import jwtUtil from '../utils/jwt.util';
import userRepository from '../repositories/user.repository';
import { Role } from '../constants/role.constant';
import { HTTP_STATUS_CODE } from '../constants/httpstatuscode.constant';

class AuthService {
	async loginHandle(req: FastifyRequest, res: FastifyResponse) {
		const { phone, password }: LoginRequest = req.body as LoginRequest;

		const user = await userRepository.findOneUser({
			phone
		});

		if (!(user && (await bcryptUtil.compare(password, user.password)))) {
			const respose = new ResponseModel(res);
			respose.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			respose.message = 'Account not exist';
			respose.send();
		}
		const respose = new ResponseModel(res);
		respose.message = 'Login success';
		respose.data = {
			access_token: jwtUtil.sign({
				user_id: user?.id
			})
		};
		return respose.send();
	}
	async registerHandle(req: FastifyRequest, res: FastifyResponse) {
		const { phone, password }: RegisterRequest = req.body as RegisterRequest;

		const user = await userRepository.findOneUser({
			phone
		});

		const respose = new ResponseModel(res);

		if (!user) {
			respose.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			respose.message = 'Phone exist';
			respose.send();
		}

		const newUser = new User();
		newUser.phone = phone;
		newUser.password = await bcryptUtil.hash(password);
		newUser.role = Role.CUSTOMER;
		await userRepository.createNewUser(newUser);

		respose.message = 'Created new user';
		return respose.send();
	}
}

export default new AuthService();
