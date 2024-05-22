import authController from '../controllers/auth.controller';
import { Fastify } from '../types/fastify.type';
import schemas from '../models/schemas/auth.schemas.model';

export default async function authRoute(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get('/login/google', authController.loginWithGoogle);
	app.get('/login/google/callback', authController.loginWithGoogleCallback);
	app.post('/login', { schema: schemas.loginSchemas }, authController.login);
	app.post(
		'/register',
		{ schema: schemas.registerSchemas },
		authController.register
	);
}
