import { Static, Type } from '@sinclair/typebox';

export const userUpdateRequestSchema = Type.Object({
	fullname: Type.String(),
	email: Type.String(),
	phone: Type.String(),
	areaId: Type.String(),
	address: Type.String(),
	createIngredientIds: Type.Optional(Type.Array(Type.String())),
	removeIngredientIds: Type.Optional(Type.Array(Type.String()))
});

export type UserUpdateRequest = Static<typeof userUpdateRequestSchema>;
