import { Static, Type } from '@sinclair/typebox';

export const cartCreateRequestSchema = Type.Object({
	has_extra_spice: Type.Boolean(),
	mealkitId: Type.String(),
	quantity: Type.Number()
});

export type CartCreateRequest = Static<typeof cartCreateRequestSchema>;

export const cartUpdateRequestSchema = Type.Object({
	cartId: Type.String(),
	has_extra_spice: Type.Boolean(),
	mealkitId: Type.String(),
	quantity: Type.Number()
});

export type CartUpdateRequest = Static<typeof cartUpdateRequestSchema>;

export const cartDeleteRequestSchema = Type.Object({
	cartIds: Type.Array(Type.String())
});

export type CartDeleteRequest = Static<typeof cartDeleteRequestSchema>;
