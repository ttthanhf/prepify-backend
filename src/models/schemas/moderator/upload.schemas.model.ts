import { Static, Type } from '@sinclair/typebox';

export const uploadDeleteRequestSchema = Type.Array(
	Type.Object({
		entityId: Type.String(),
		type: Type.String()
	})
);

export type UploadDeleteRequestSchema = Static<
	typeof uploadDeleteRequestSchema
>;
