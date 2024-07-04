import { Static, Type } from '@sinclair/typebox';
import { LevelCook } from '~constants/levelcook.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';

export const recipeCreateRequestSchema = Type.Object({
	name: Type.String(),
	ingredients: Type.Array(
		Type.Object({
			ingredient_id: Type.String(),
			amount: Type.Number(),
			unit_id: Type.String()
		})
	),
	category: Type.String(),
	foodStyles: Type.Array(Type.String()),
	steps: Type.String(),
	nutrition: Type.Array(
		Type.Object({
			nutrition_id: Type.String(),
			amount: Type.Number(),
			unit_id: Type.String()
		})
	),
	images: Type.Optional(Type.Array(Type.String())),
	imagesExtraSpice: Type.Optional(Type.Array(Type.String())),
	time: Type.Number({ description: 'Time cook' }),
	videoUrl: Type.Optional(Type.String({ description: 'URL youtube' })),
	level: Type.Enum(LevelCook),
	mealKits: Type.Array(
		Type.Object({
			mealKit: Type.Object({
				serving: Type.Number(),
				price: Type.Number()
			}),
			extraSpice: Type.Optional(
				Type.Object({
					imageName: Type.String(),
					name: Type.String(),
					price: Type.Number()
				})
			)
		})
	)
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
