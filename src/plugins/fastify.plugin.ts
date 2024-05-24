import { Fastify } from '~types/fastify.type';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';

export default async function plugins(
	app: Fastify,
	options: unknown,
	next: CallableFunction
) {
	app.register(cors);
	app.register(helmet);
	next();
}
