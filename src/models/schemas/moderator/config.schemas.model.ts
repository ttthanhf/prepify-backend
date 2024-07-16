import { Static, Type } from '@sinclair/typebox';

export const configUpdateRequestSchema = Type.Object({
	value: Type.Number()
});

export type ConfigUpdateRequest = Static<typeof configUpdateRequestSchema>;
