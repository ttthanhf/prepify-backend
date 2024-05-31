import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import { User } from '~models/entities/user.entity';
import {
	ForgotPasswordRequest,
	LoginRequest,
	RegisterRequest,
	ResetPasswordRequest,
	VerifyResetPasswordRequest
} from '~models/requests/auth.request.model';
import bcryptUtil from '~utils/bcrypt.util';
import ResponseModel from '~models/responses/response.model';
import jwtUtil from '~utils/jwt.util';
import userRepository from '~repositories/user.repository';
import { Role } from '~constants/role.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { AuthorizationTokenConfig } from 'simple-oauth2';
import oauth2Util from '~utils/oauth2.util';
import mailUtil from '~utils/mail.util';
import envConfig from '~configs/env.config';
import redisUtil from '~utils/redis.util';
import { Token } from '~constants/token.constant';

class AuthService {
	private getAccessToken(user: User) {
		return {
			access_token: jwtUtil.sign({
				userId: user.id
			})
		};
	}

	async loginHandle(req: FastifyRequest, res: FastifyResponse) {
		const { email, phone, password }: LoginRequest = req.body as LoginRequest;
		const user = await userRepository.findOneUser(
			email ? { email } : { phone }
		);

		const respose = new ResponseModel(res);

		if (user && (await bcryptUtil.compare(password, user.password))) {
			respose.message = 'Login success';
			respose.data = this.getAccessToken(user);
			return respose.send();
		}

		respose.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
		respose.message = 'Account not exist';
		return respose.send();
	}
	async registerHandle(req: FastifyRequest, res: FastifyResponse) {
		const { phone, password, email, fullname }: RegisterRequest =
			req.body as RegisterRequest;

		const user = await userRepository.findOneUser({
			$or: [{ email: email || undefined }, { phone: phone || undefined }]
		});

		const respose = new ResponseModel(res);

		if (user) {
			respose.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			respose.message = 'Email or phone exist';
			return respose.send();
		}

		const newUser = new User();
		newUser.phone = phone;
		newUser.email = email;
		newUser.fullname = fullname;
		newUser.password = await bcryptUtil.hash(password);
		newUser.role = Role.CUSTOMER;
		await userRepository.createNewUser(newUser);

		respose.message = 'Created new user';
		respose.data = this.getAccessToken(newUser);
		return respose.send();
	}

	async getUrlGoogle(req: FastifyRequest, res: FastifyResponse) {
		const respose = new ResponseModel(res);
		respose.data = {
			url: oauth2Util.getUrlGoogleLogin()
		};
		return respose.send();
	}
	async loginWithGoogleHandle(
		req: FastifyRequest<{ Querystring: AuthorizationTokenConfig }>,
		res: FastifyResponse
	) {
		const { email, name, picture } = await oauth2Util.getUserInfo(req);

		const response = new ResponseModel(res);

		const user = await userRepository.findOneUser({
			email
		});

		if (user) {
			response.message = 'Login success';
			response.data = this.getAccessToken(user);
			return response.send();
		}

		const newUser = new User();
		newUser.fullname = name;
		newUser.role = Role.CUSTOMER;
		newUser.email = email;
		newUser.avatar = picture;
		await userRepository.createNewUser(newUser);

		response.message = 'Created new user';
		response.data = this.getAccessToken(newUser);
		return response.send();
	}
	async forgotPasswordHandle(req: FastifyRequest, res: FastifyResponse) {
		const { email }: ForgotPasswordRequest = req.body as ForgotPasswordRequest;

		const response = new ResponseModel(res);

		if ((await redisUtil.getEmailRecoveryWhiteList(email)) !== null) {
			response.message = 'You must wait 1 minute after we send the email';
			response.statusCode = HTTP_STATUS_CODE.FORBIDDEN;
			return response.send();
		}

		const user = await userRepository.findOneUser({
			email
		});

		if (!user) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			response.message = 'Email not found in system';
			return response.send();
		}

		const access_token = jwtUtil.sign(
			{
				userId: user.id,
				type: Token.FORGOTPASSWORD
			},
			envConfig.MAIL_EXPIRE
		);

		mailUtil.sendMailRecoveryPassword(user.email, access_token);
		await redisUtil.setEmailRecoveryWhiteList(user.email);
		await redisUtil.setTokenRecoveryPasswordWhiteList(access_token);
		response.message = 'Sent email';

		return response.send();
	}
	async verifyForgotPasswordHandle(req: FastifyRequest, res: FastifyResponse) {
		const { token }: VerifyResetPasswordRequest =
			req.body as VerifyResetPasswordRequest;

		const response = new ResponseModel(res);

		const info = jwtUtil.verify(token);

		if (
			(await redisUtil.getTokenRecoveryPasswordWhiteList(token)) === null ||
			info?.type !== Token.FORGOTPASSWORD
		) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Token invaild';
			return response.send();
		}

		response.message = 'Success';
		response.data = {
			success: true
		};
		return response.send();
	}
	async resetPasswordHandle(req: FastifyRequest, res: FastifyResponse) {
		const { token, password }: ResetPasswordRequest =
			req.body as ResetPasswordRequest;

		const response = new ResponseModel(res);
		if ((await redisUtil.getTokenRecoveryPasswordWhiteList(token)) === null) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Token invalid';
			return response.send();
		}

		const info = jwtUtil.verify(token);

		if (info?.type != Token.FORGOTPASSWORD) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Token invalid';
			return response.send();
		}

		const user = await userRepository.findOneUser({
			id: info.userId
		});

		if (!user) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Token invalid';
			return response.send();
		}

		user.password = await bcryptUtil.hash(password);
		response.message = 'Reset password successfully';
		userRepository.updateUser(user);
		redisUtil.removeTokenRecoveryPasswordWhiteList(token);
		return response.send();
	}
}

export default new AuthService();
