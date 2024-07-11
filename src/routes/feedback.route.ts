import feedbackController from '~controllers/feedback.controller';
import authMiddleware from '~middlewares/auth.middleware';
import {
	feedbackCreateRequestSchema,
	feedbackGetRequestSchema
} from '~models/schemas/feedback.schemas.model';
import { Fastify } from '~types/fastify.type';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.post(
		'/feedback',
		{
			schema: {
				body: feedbackCreateRequestSchema
			},
			onRequest: [authMiddleware.requireToken]
		},
		feedbackController.createFeedback
	);

	app.get(
		'/feedback/:recipe_slug',
		{
			schema: {
				querystring: feedbackGetRequestSchema
			}
		},
		feedbackController.getFeedbackByRecipeSlug
	);
}
