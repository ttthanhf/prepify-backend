import { Role } from '~constants/role.constant';
import {
	FastifyInstance,
	FastifyRequest,
	FastifyReply,
	FastifyBaseLogger,
	FastifyTypeProviderDefault,
	RouteGenericInterface,
	FastifySchema,
	RouteHandlerMethod
} from 'fastify';
import {
	Http2SecureServer,
	Http2ServerRequest,
	Http2ServerResponse
} from 'http2';

declare module 'fastify' {
	interface FastifyContextConfig {
		allowedRoles?: Role[];
	}
}

interface FastifyInitConfig {
	logger: boolean;
}

export type Fastify =
	| FastifyInstance<
			Http2SecureServer,
			Http2ServerRequest,
			Http2ServerResponse,
			FastifyBaseLogger,
			FastifyTypeProviderDefault
	  >
	| FastifyRequest
	| any;

export type FastifyResponse =
	| FastifyReply<
			Http2SecureServer,
			Http2ServerRequest,
			Http2ServerResponse,
			RouteGenericInterface,
			unknown,
			FastifySchema,
			FastifyTypeProviderDefault,
			unknown
	  >
	| FastifyReply
	| any;

export type FastifyRoute = RouteHandlerMethod<
	Http2SecureServer,
	Http2ServerRequest,
	Http2ServerResponse,
	RouteGenericInterface,
	unknown,
	FastifySchema,
	FastifyTypeProviderDefault,
	FastifyBaseLogger
>;

export type { FastifyInitConfig, FastifyRequest };
