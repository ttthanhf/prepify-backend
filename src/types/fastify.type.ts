import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface FastifyInitConfig {
	logger: boolean;
}

interface FastifyListenConfig {
	port: number;
}

export {
	FastifyInitConfig,
	FastifyListenConfig,
	FastifyInstance as Fastify,
	FastifyRequest,
	FastifyReply as FastifyResponse
};
