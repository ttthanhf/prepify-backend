import { FastifyRequest } from 'fastify';
import feedbackService from '~services/feedback.service';
import { FastifyResponse } from '~types/fastify.type';

class FeedbackController {
	async createFeedback(req: FastifyRequest, res: FastifyResponse) {
		return feedbackService.createFeedbackHandle(req, res);
	}

	async getFeedbackByRecipeSlug(req: FastifyRequest, res: FastifyResponse) {
		return feedbackService.getFeedbackByRecipeSlugHandle(req, res);
	}
}
export default new FeedbackController();
