import { Fastify } from '~types/fastify.type';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import auth from '@fastify/auth';

export default async function plugins(
	app: Fastify,
	options: unknown,
	next: CallableFunction
) {
	app.register(helmet);
	app.register(cors);
	app.register(auth);
	return next();
}
