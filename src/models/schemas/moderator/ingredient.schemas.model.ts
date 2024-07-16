import { Static, Type } from '@sinclair/typebox';
import { OrderBy, SortBy } from '~constants/sort.constant';

export const ingredientModeratorQueryGetRequestSchema = Type.Object({
	pageSize: Type.Optional(Type.Number()),
	pageIndex: Type.Optional(Type.Number()),
	orderBy: Type.Optional(Type.Enum(OrderBy)),
	sortBy: Type.Optional(Type.Enum(SortBy)),
	search: Type.Optional(Type.String())
});

export type IngredientModeratorQueryGetRequest = Static<
	typeof ingredientModeratorQueryGetRequestSchema
>;

export const ingredientModeratorCreateRequestSchema = Type.Object({
	name: Type.String(),
	price: Type.Number(),
	unit: Type.String(),
	category: Type.String(),
	imageURL: Type.String()
});

export type IngredientModeratorCreateRequest = Static<
	typeof ingredientModeratorCreateRequestSchema
>;

export const ingredientModeratorUpdateRequestSchema =
	ingredientModeratorCreateRequestSchema;

export type IngredientModeratorUpdateRequest = Static<
	typeof ingredientModeratorUpdateRequestSchema
>;
