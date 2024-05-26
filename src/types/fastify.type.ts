import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
	interface FastifyContextConfig {
		allowedRoles?: string[];
	}

	type Authorize = (
		request: FastifyRequest,
		reply: FastifyReply
	) => Promise<void>;

	/** Apply the extension */
	interface FastifyInstance {
		authorize: Authorize;
	}
}

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
