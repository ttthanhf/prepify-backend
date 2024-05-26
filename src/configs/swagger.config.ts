import swagger from '@fastify/swagger';
import swagger_ui from '@fastify/swagger-ui';
import envConfig from './env.config';

const SWAGGER_CONFIG = {
	openapi: {
		openapi: '3.0.0',
		info: {
			title: 'Perpify API',
			description: 'API ui for Perpify API',
			version: '0.0.0.1'
		},
		servers: [
			{
				url: `http://localhost:${envConfig.SERVER_PORT}`,
				description: 'Localhost'
			},
			{
				url: 'https://prepifyb.thanhf.dev/',
				description: 'BE server'
			}
		],
		components: {
			securitySchemes: {
				access_token: {
					type: 'apiKey',
					in: 'cookie',
					name: 'access_token'
				}
			}
		},
		security: [
			{
				access_token: []
			}
		],
		externalDocs: {
			url: 'https://editor.swagger.io/',
			description: 'Editor in swagger.io'
		}
	}
};

const SWAGGER_UI_CONFIG = {
	routePrefix: '/docs',
	uiConfig: {
		docExpansion: 'list',
		deepLinking: false
	},
	uiHooks: {
		onRequest: function (request: unknown, reply: unknown, next: any) {
			next();
		},
		preHandler: function (request: unknown, reply: unknown, next: any) {
			next();
		}
	},
	staticCSP: true,
	transformStaticCSP: (header: unknown) => header,
	transformSpecification: (
		swaggerObject: unknown,
		request: unknown,
		reply: unknown
	) => {
		return swaggerObject;
	},
	transformSpecificationClone: true
};

export default function swaggerConfig(app: any) {
	app.register(swagger, SWAGGER_CONFIG);
	app.register(swagger_ui, SWAGGER_UI_CONFIG);
}
