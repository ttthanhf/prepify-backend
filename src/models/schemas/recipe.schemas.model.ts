import { Static, Type } from '@sinclair/typebox';
import { OrderBy, SortBy } from '~constants/sort.constant';

export const recipeQueryGetRequestSchema = Type.Object({
	pageSize: Type.Optional(Type.Number()),
	pageIndex: Type.Optional(Type.Number()),
	orderBy: Type.Optional(Type.Enum(OrderBy)),
	sortBy: Type.Optional(Type.Enum(SortBy)),
	foodStyles: Type.Optional(Type.String()),
	minPrice: Type.Optional(Type.Number()),
	maxPrice: Type.Optional(Type.Number()),
	searchRecipe: Type.Optional(Type.String()),
	minRating: Type.Optional(Type.Number()),
	maxRating: Type.Optional(Type.Number())
});

export type RecipeGetRequest = Static<typeof recipeQueryGetRequestSchema>;
