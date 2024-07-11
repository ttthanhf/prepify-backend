import { SwaggerTag } from '~constants/swaggertag.constant';
import authController from '~controllers/auth.controller';
import authMiddleware from '~middlewares/auth.middleware';
import {
	changePasswordSchema,
	forgotPasswordSchema,
	googleOauth2Schema,
	loginRequestSchema,
	registerRequestSchema,
	resetPasswordSchema,
	verifyForgotPasswordSchema
} from '~models/schemas/auth.schemas.model';
import { Fastify } from '~types/fastify.type';

export default async function authRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/login/google',
		{
			schema: {
				tags: [SwaggerTag.AUTHENTICATION]
			}
		},
		authController.getUrlGoogle
	);
	app.post(
		'/login/google',
		{
			schema: {
				tags: [SwaggerTag.AUTHENTICATION],
				body: googleOauth2Schema
			}
		},
		authController.loginWithGoogle
	);
	app.post(
		'/login',
		{
			schema: {
				tags: [SwaggerTag.AUTHENTICATION],
				body: loginRequestSchema
			}
		},
		authController.login
	);
	app.post(
		'/register',
		{
			schema: {
				tags: [SwaggerTag.AUTHENTICATION],
				body: registerRequestSchema
			}
		},
		authController.register
	);
	app.post(
		'/forgot-password',
		{
			schema: {
				tags: [SwaggerTag.AUTHENTICATION],
				body: forgotPasswordSchema
			}
		},
		authController.forgotPassword
	);
	app.post(
		'/verify-token-forgot-password',
		{
			schema: {
				tags: [SwaggerTag.AUTHENTICATION],
				body: verifyForgotPasswordSchema
			}
		},
		authController.verifyForgotPassword
	);
	app.post(
		'/reset-password',
		{
			schema: {
				tags: [SwaggerTag.AUTHENTICATION],
				body: resetPasswordSchema
			}
		},
		authController.resetPassword
	);
	app.put(
		'/change-password',
		{
			schema: {
				tags: [SwaggerTag.AUTHENTICATION],
				body: changePasswordSchema
			},
			onRequest: [authMiddleware.requireToken]
		},
		authController.changePassword
	);
}
