import { Static, Type } from '@sinclair/typebox';

export const checkoutCreateRequestSchema = Type.Object({
	cartIds: Type.Array(Type.String())
});

export type CheckoutCreateRequest = Static<typeof checkoutCreateRequestSchema>;
