import { FastifyListenConfig } from '~types/fastify.type';
import envConfig from './env.config';

const fastifyInitConfig: any = {
	logger: {
		transport: {
			target: '@fastify/one-line-logger'
		}
	}
};

const fastifyListenConfig: FastifyListenConfig = {
	port: Number(envConfig.SERVER_PORT)
};

export default {
	fastifyInitConfig,
	fastifyListenConfig
};
