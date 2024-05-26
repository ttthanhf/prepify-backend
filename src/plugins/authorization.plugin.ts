import fastifyPlugin from 'fastify-plugin';
import auth, { FastifyAuthPluginOptions } from '@fastify/auth';
import { Fastify, FastifyRequest, FastifyResponse } from '@/types/fastify.type';
import userRepository from '@/repositories/user.repository';
import cookieUtil from '@/utils/cookie.util';
import jwtUtil from '@/utils/jwt.util';

export default fastifyPlugin<FastifyAuthPluginOptions>(async (app: Fastify) => {
	app.register(auth);

	app.decorate(
		'authorize',
		async (req: FastifyRequest, res: FastifyResponse) =>
			await authorizeDecorator(req, res)
	);
});

export const authorizeDecorator = async (
	request: FastifyRequest,
	response: FastifyResponse
): Promise<void> => {
	const allowedRoles = request.routeOptions.config.allowedRoles;
	const cookies = cookieUtil.extract(request.headers);
	const token = jwtUtil.verify(cookies.access_token);

	if (allowedRoles && token) {
		const user = await userRepository.findOneUser({
			id: token.user_id
		});
		const userRole = user!.role;

		if (!allowedRoles.includes(userRole)) {
			throw Error('Permission denied');
		}
	}
};
