import envConfig from './env.config';
import { FastifyListenOptions } from 'fastify';

const fastifyInitConfig: any = {
	logger: {
		level: envConfig.LOG_LEVEL || 'debug',
		transport: {
			target: '@fastify/one-line-logger'
		}
	}
};

const fastifyListenConfig: FastifyListenOptions = {
	port: Number(envConfig.SERVER_PORT),
	host: '0.0.0.0'
};

export default {
	fastifyInitConfig,
	fastifyListenConfig
};
