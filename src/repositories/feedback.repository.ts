import { Feedback } from '~models/entities/feedback.entity';
import { BaseRepository } from './base.repository';

class FeedbackRepository extends BaseRepository<Feedback> {
	constructor() {
		super(Feedback);
	}
}

export default new FeedbackRepository();
