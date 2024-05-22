import ResponseModel from '../models/responses/response.model';
import { FastifyRequest, FastifyResponse } from '../types/fastify.type';
import cookieUtil from '../utils/cookie.util';
import jwtUtil from '../utils/jwt.util';
import { HTTP_STATUS_CODE } from '../constants/httpstatuscode.constant';

export default async function authMiddleware(
	req: FastifyRequest,
	res: FastifyResponse
) {
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
