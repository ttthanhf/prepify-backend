import { Static, Type } from '@sinclair/typebox';
import { OrderBy, SortBy } from '~constants/sort.constant';

export const recipeModeratorQueryGetRequestSchema = Type.Object({
	pageSize: Type.Optional(Type.Number()),
	pageIndex: Type.Optional(Type.Number()),
	orderBy: Type.Optional(Type.Enum(OrderBy)),
	sortBy: Type.Optional(Type.Enum(SortBy)),
	searchRecipe: Type.Optional(Type.String()),
	cookLevel: Type.Optional(Type.String()),
	category: Type.Optional(Type.String())
});

export type recipeModeratorQueryGetRequest = Static<
	typeof recipeModeratorQueryGetRequestSchema
>;
