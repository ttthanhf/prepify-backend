import { Static, Type } from '@sinclair/typebox';

export const cartCreateRequestSchema = Type.Object({
	mealkitId: Type.String(),
	quantity: Type.Number()
});

export type CartCreateRequest = Static<typeof cartCreateRequestSchema>;

export const cartUpdateRequestSchema = cartCreateRequestSchema;

export type CartUpdateRequest = Static<typeof cartUpdateRequestSchema>;

export const cartDeleteRequestSchema = Type.Object({
	cartIds: Type.Array(Type.String())
});

export type CartDeleteRequest = Static<typeof cartDeleteRequestSchema>;
