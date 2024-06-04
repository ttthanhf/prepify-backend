import ResponseModel from '~models/responses/response.model';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import jwtUtil from '~utils/jwt.util';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import userRepository from '~repositories/user.repository';
import headerUtil from '~utils/header.util';

async function requireToken(req: FastifyRequest, res: FastifyResponse) {
	const token = headerUtil.extractAuthorization(req.headers);
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
	const token = headerUtil.extractAuthorization(req.headers);
	const info = jwtUtil.verify(token);
	const user = await userRepository.findOneBy({
		id: info.userId
	});
	if (!user?.phone) {
		const reponse = new ResponseModel(res);
		reponse.statusCode = HTTP_STATUS_CODE.FORBIDDEN;
		reponse.message = 'Phone require';
		reponse.send();
	}
}

async function verifyRole(
	req: FastifyRequest,
	res: FastifyResponse
): Promise<void> {
	const allowedRoles = req.routeOptions.config.allowedRoles;
	const token = headerUtil.extractAuthorization(req.headers);
	const info = jwtUtil.verify(token);

	const response = new ResponseModel(res);

	if (allowedRoles && token) {
		const user = await userRepository.findOneBy({
			id: info.userId
		});
		const userRole = user!.role;

		if (!allowedRoles.includes(userRole)) {
			response.statusCode = HTTP_STATUS_CODE.FORBIDDEN;
			response.message = 'Role not allowed';
			response.send();
		}
	}
}

export default { verifyRole, requireToken, requirePhone };
