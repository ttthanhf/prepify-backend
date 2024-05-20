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

class AuthService {
	async loginHandle(req: FastifyRequest, res: FastifyResponse) {
		const { phone, password }: LoginRequest = req.body as LoginRequest;

		const user = await userRepository.findOneUserWithPhone(phone);
		if (user && (await bcryptUtil.compare(password, user.password))) {
			const respose = new ResponseModel();
			respose.statusCode = 200;
			respose.message = 'Login successful';
			respose.data = {
				access_token: await jwtUtil.sign({
					user_id: user.id
				})
			};
			return respose;
		}
		const respose = new ResponseModel();
		respose.statusCode = 400;
		respose.message = 'Account not exist';
		respose.data = null;
		return respose;
	}
	async registerHandle(req: FastifyRequest, res: FastifyResponse) {
		const { phone, password }: RegisterRequest = req.body as RegisterRequest;
		const user = await userRepository.findOneUserWithPhone(phone);
		if (user) {
			const respose = new ResponseModel();
			respose.statusCode = 400;
			respose.message = 'Phone exist';
			respose.data = null;
			return respose;
		}

		const newUser = new User();
		newUser.phone = phone;
		newUser.password = await bcryptUtil.hash(password);
		newUser.role = Role.CUSTOMER;
		await userRepository.createNewUser(newUser);

		const respose = new ResponseModel();
		respose.statusCode = 200;
		respose.message = 'Created new user';
		respose.data = null;
		return respose;
	}
}

export default new AuthService();
