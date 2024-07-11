export class FeedbackType {
	id!: string;
	image!: string; // avatar user
	fullName!: string;
	rating!: number;
	content!: string;
	createdAt!: string;
}

export class RatingType {
	rating!: number;
	total!: number;
}

export class FeedbackReponse {
	feedbacks!: FeedbackType[];
	ratings!: RatingType[];
}
