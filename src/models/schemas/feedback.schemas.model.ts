import { Static, Type } from '@sinclair/typebox';

export const feedbackCreateRequestSchema = Type.Array(
	Type.Object({
		content: Type.Optional(Type.String()),
		rating: Type.Number(),
		orderDetailId: Type.String()
	})
);

export type FeedbackCreateRequest = Static<typeof feedbackCreateRequestSchema>;

export const feedbackGetRequestSchema = Type.Object({
	pageSize: Type.Optional(Type.Number()),
	pageIndex: Type.Optional(Type.Number()),
	rating: Type.Optional(Type.Number())
});

export type FeedbackGetRequest = Static<typeof feedbackGetRequestSchema>;
