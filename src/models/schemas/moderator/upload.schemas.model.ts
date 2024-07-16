import { Static, Type } from '@sinclair/typebox';

export const uploadDeleteRequestSchema = Type.Array(
	Type.Object({
		url: Type.Optional(Type.String()),
		entityId: Type.Optional(Type.String()),
		type: Type.String()
	})
);

export type UploadDeleteRequestSchema = Static<
	typeof uploadDeleteRequestSchema
>;
