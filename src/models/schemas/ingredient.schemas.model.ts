import { Static, Type } from '@sinclair/typebox';

export const ingredientGetRequestSchema = Type.Object({
	id: Type.Optional(Type.String()),
	name: Type.Optional(Type.String()),
	category: Type.Optional(Type.String()),
	price: Type.Optional(Type.String())
});

export type IngredientGetRequest = Static<typeof ingredientGetRequestSchema>;
