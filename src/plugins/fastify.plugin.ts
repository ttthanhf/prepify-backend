import { Fastify } from '~types/fastify.type';
import cors from '@fastify/cors';
import fp from 'fastify-plugin';
import multipart from '@fastify/multipart';

function fastifyPlugin(app: Fastify, opts: Object, next: CallableFunction) {
	app.register(cors, {
		origin: ['http://localhost:3000', 'https://prepify.thanhf.dev'],
		credentials: true
	});
	app.register(multipart);
	next();
}

module.exports = fp(fastifyPlugin);
