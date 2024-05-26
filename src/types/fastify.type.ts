import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface FastifyInitConfig {
	logger: boolean;
}

export {
	FastifyInitConfig,
	FastifyInstance as Fastify,
	FastifyRequest,
	FastifyReply as FastifyResponse
};
