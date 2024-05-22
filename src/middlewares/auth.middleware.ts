import ResponseModel from '../models/responses/response.model';
import { FastifyRequest, FastifyResponse } from '../types/fastify.type';
import cookieUtil from '../utils/cookie.util';
import jwtUtil from '../utils/jwt.util';
import { HTTP_STATUS_CODE } from '../constants/httpstatuscode.constant';
import userRepository from '../repositories/user.repository';

async function requireToken(req: FastifyRequest, res: FastifyResponse) {
	const cookies = cookieUtil.extract(req.headers);
	const token = cookies.access_token;

	const isValid = jwtUtil.verify(token);

	const reponse = new ResponseModel(res);

	if (!token) {
		reponse.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
		reponse.message = 'Token not found';
		reponse.send();
	}
	if (!isValid) {
		reponse.statusCode = HTTP_STATUS_CODE.FORBIDDEN;
		reponse.message = 'Token invalid';
		reponse.send();
	}
}

async function requirePhone(req: FastifyRequest, res: FastifyResponse) {
	const cookies = cookieUtil.extract(req.headers);
	const token = jwtUtil.verify(cookies.access_token);

	const user = await userRepository.findOneUser({
		id: token.user_id
	});

	if (!user?.phone) {
		const reponse = new ResponseModel(res);
		reponse.statusCode = HTTP_STATUS_CODE.FORBIDDEN;
		reponse.message = 'Phone require';
		reponse.send();
	}
}

export default { requireToken, requirePhone };
