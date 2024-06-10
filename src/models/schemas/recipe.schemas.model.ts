import { Static, Type } from '@sinclair/typebox';
import { OrderBy, SortBy } from '~constants/sort.constant';

export const recipeCreateRequestSchema = Type.Object({
	name: Type.String(),
	ingredients: Type.Array(
		Type.Object({
			ingredient_id: Type.Number(),
			amount: Type.Number(),
			unit_id: Type.Number()
		})
	),
	category: Type.Number(),
	foodStyle: Type.Array(Type.Number()),
	steps: Type.String(),
	nutrition: Type.Array(
		Type.Object({
			nutrition_id: Type.Number(),
			amount: Type.Number(),
			unit_id: Type.Number()
		})
	),
	images: Type.Optional(Type.Array(Type.String())),
	time: Type.Number({ description: 'Time cook' }),
	video: Type.Optional(Type.String({ description: 'URL youtube' })),
	level: Type.String()
});

export type RecipeCreateRequest = Static<typeof recipeCreateRequestSchema>;

export const recipeUpdateRequestSchema = Type.Partial(
	recipeCreateRequestSchema
);

export type RecipeUpdateRequest = Static<typeof recipeUpdateRequestSchema>;

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
