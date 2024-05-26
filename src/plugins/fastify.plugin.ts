import { Fastify } from '~types/fastify.type';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fp from 'fastify-plugin';

function fastifyPlugin(app: Fastify, opts: Object, next: CallableFunction) {
	app.register(cors);
	app.register(helmet);
	next();
}

module.exports = fp(fastifyPlugin);
