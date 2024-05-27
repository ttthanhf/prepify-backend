import fastifyPlugin from 'fastify-plugin';
import auth, { FastifyAuthPluginOptions } from '@fastify/auth';
import { Fastify, FastifyRequest, FastifyResponse } from '@/types/fastify.type';
import authMiddleware from '@/middlewares/auth.middleware';

export default fastifyPlugin<FastifyAuthPluginOptions>(async (app: Fastify) => {
	app.register(auth);

	app.decorate(
		'authorize',
		async (req: FastifyRequest, res: FastifyResponse) =>
			await authMiddleware.verifyRole(req, res)
	);
});
