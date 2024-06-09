import { Static, Type } from '@sinclair/typebox';

export const cartCreateRequestSchema = Type.Object({
	mealkitId: Type.String(),
	quantity: Type.Number()
});

export type CartCreateRequest = Static<typeof cartCreateRequestSchema>;
