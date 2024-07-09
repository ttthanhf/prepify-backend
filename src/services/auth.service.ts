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
import { Customer } from '~models/entities/customer.entity';
import customerRepository from '~repositories/customer.repository';

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
		const response = new ResponseModel(res);

		if (!(email || phone)) {
			response.message = 'Missing phone or email field';
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			return response.send();
		}

		const user = await userRepository.findOneBy(email ? { email } : { phone });

		if (!user?.password) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			response.message = 'Account not exist';
			return response.send();
		}

		if (user && (await bcryptUtil.compare(password, user.password!))) {
			response.message = 'Login success';
			response.data = this.getAccessToken(user);
			return response.send();
		}

		response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
		response.message = 'Account not exist';
		return response.send();
	}
	async registerHandle(req: FastifyRequest, res: FastifyResponse) {
		const { phone, password, email, fullname }: RegisterRequest =
			req.body as RegisterRequest;

		const user = await userRepository.find({
			where: [{ email: email || undefined }, { phone: phone || undefined }]
		});

		const response = new ResponseModel(res);

		if (user.length != 0) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Email or phone exist';
			return response.send();
		}

		const newUser = new User();
		newUser.phone = phone;
		newUser.email = email;
		newUser.fullname = fullname;
		newUser.password = await bcryptUtil.hash(password);
		newUser.role = Role.CUSTOMER;
		await userRepository.create(newUser);

		const newCustomer = new Customer();
		newCustomer.user = newUser;
		await customerRepository.create(newCustomer);

		response.message = 'Created new user';
		response.data = this.getAccessToken(newUser);
		return response.send();
	}

	async getUrlGoogle(req: FastifyRequest, res: FastifyResponse) {
		const response = new ResponseModel(res);
		response.data = {
			url: oauth2Util.getUrlGoogleLogin()
		};
		return response.send();
	}
	async loginWithGoogleHandle(
		req: FastifyRequest<{ Querystring: AuthorizationTokenConfig }>,
		res: FastifyResponse
	) {
		const { email, name, picture } = await oauth2Util.getUserInfo(req);

		const response = new ResponseModel(res);

		const user = await userRepository.findOneBy({
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
		// newUser.avatar = picture;
		await userRepository.create(newUser);

		const newCustomer = new Customer();
		newCustomer.user = newUser;
		await customerRepository.create(newCustomer);

		response.message = 'Created new user';
		response.data = this.getAccessToken(newUser);
		return response.send();
	}
	async forgotPasswordHandle(req: FastifyRequest, res: FastifyResponse) {
		const { 'user-agent': userAgent } = req.headers;
		const { email }: ForgotPasswordRequest = req.body as ForgotPasswordRequest;

		const response = new ResponseModel(res);

		if ((await redisUtil.getEmailRecoveryWhiteList(email)) !== null) {
			response.message = 'You must wait 1 minute after we send the email';
			response.statusCode = HTTP_STATUS_CODE.FORBIDDEN;
			return response.send();
		}

		const user = await userRepository.findOneBy({
			email
		});

		if (!user) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			response.message = 'Email not found in system';
			return response.send();
		}

		const redirectBaseUrl = userAgent!.includes('Android')
			? envConfig.MAIL_REDIRECT_MOBILE
			: envConfig.MAIL_REDIRECT;

		const access_token = jwtUtil.sign(
			{
				userId: user.id,
				type: Token.FORGOTPASSWORD
			},
			envConfig.MAIL_EXPIRE
		);

		mailUtil.sendMailRecoveryPassword(
			user.email,
			redirectBaseUrl + access_token
		);
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
			response.message = 'Token invalid';
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

		const user = await userRepository.findOneBy({
			id: info.userId
		});

		if (!user) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Token invalid';
			return response.send();
		}

		user.password = await bcryptUtil.hash(password);
		response.message = 'Reset password successfully';
		userRepository.update(user);
		redisUtil.removeTokenRecoveryPasswordWhiteList(token);
		return response.send();
	}
}

export default new AuthService();
