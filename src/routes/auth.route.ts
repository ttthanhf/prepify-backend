import authController from '~controllers/auth.controller';
import {
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
	app.get('/login/google', authController.getUrlGoogle);
	app.post(
		'/login/google',
		{ schema: googleOauth2Schema },
		authController.loginWithGoogle
	);
	app.post(
		'/login',
		{
			schema: {
				body: loginRequestSchema
			}
		},
		authController.login
	);
	app.post(
		'/register',
		{
			schema: {
				body: registerRequestSchema
			}
		},
		authController.register
	);
	app.post(
		'/forgot-password',
		{
			schema: forgotPasswordSchema
		},
		authController.forgotPassword
	);
	app.post(
		'/verify-token-forgot-password',
		{
			schema: verifyForgotPasswordSchema
		},
		authController.verifyForgotPassword
	);
	app.post(
		'/reset-password',
		{
			schema: resetPasswordSchema
		},
		authController.resetPassword
	);
}
