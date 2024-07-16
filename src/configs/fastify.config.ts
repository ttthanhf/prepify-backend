import { ENVIROMENT } from '~constants/env.constant';
import envConfig from './env.config';
import { FastifyListenOptions } from 'fastify';

const fastifyInitConfig: any = {
	logger: {
		level: envConfig.LOG_LEVEL || 'debug',
		transport: {
			target: '@fastify/one-line-logger'
		}
	},
	disableRequestLogging: envConfig.ENVIROMENT == ENVIROMENT.PRODUCTION,
	bodyLimit: 100 * 1024 * 1024,
	connectionTimeout: 0,
	keepAliveTimeout: 5000
};

const fastifyListenConfig: FastifyListenOptions = {
	port: Number(envConfig.SERVER_PORT),
	host: '0.0.0.0'
};

export default {
	fastifyInitConfig,
	fastifyListenConfig
};
