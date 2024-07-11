import { Static, Type } from '@sinclair/typebox';
import { LevelCook } from '~constants/levelcook.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';

//ingredient
export const ingredientRecipeRequestSchema = Type.Object({
	id: Type.Optional(Type.String()),
	ingredient_id: Type.String(),
	amount: Type.Number(),
	unit_id: Type.String()
});

export const ingredientRecipeUpdateRequestSchema = Type.Object({
	ingredients: Type.Optional(Type.Array(ingredientRecipeRequestSchema)),
	removeIds: Type.Optional(Type.Array(Type.String()))
});

export type IngredientRecipeUpdateRequestSchema = Static<
	typeof ingredientRecipeUpdateRequestSchema
>;
//ingredient

//nutrition
export const nutritionRecipeRequestSchema = Type.Object({
	id: Type.Optional(Type.String()),
	nutrition_id: Type.String(),
	amount: Type.Number(),
	unit_id: Type.String()
});

export const nutritionRecipeUpdateRequestSchema = Type.Object({
	nutrition: Type.Optional(Type.Array(nutritionRecipeRequestSchema)),
	removeIds: Type.Optional(Type.Array(Type.String()))
});

export type NutritionRecipeUpdateRequestSchema = Static<
	typeof nutritionRecipeUpdateRequestSchema
>;
//nutrition

//mealKits
export const mealkitsRecipeRequestSchema = Type.Object({
	mealKit: Type.Object({
		id: Type.Optional(Type.String()),
		serving: Type.Number(),
		price: Type.Number()
	}),
	extraSpice: Type.Optional(
		Type.Object({
			id: Type.Optional(Type.String()),
			name: Type.String(),
			price: Type.Number()
		})
	)
});

export const mealkitsRecipeUpdateRequestSchema = Type.Object({
	mealKits: Type.Optional(Type.Array(mealkitsRecipeRequestSchema)),
	removeIds: Type.Optional(Type.Array(Type.String()))
});

export type MealkitsRecipeUpdateRequestSchema = Static<
	typeof mealkitsRecipeUpdateRequestSchema
>;

//mealKits

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

export const recipeCreateRequestSchema = Type.Object({
	name: Type.String(),
	ingredients: Type.Array(ingredientRecipeRequestSchema),
	category: Type.String(),
	foodStyles: Type.Array(Type.String()),
	steps: Type.String(),
	nutrition: Type.Array(nutritionRecipeRequestSchema),
	images: Type.Optional(Type.Array(Type.String())),
	imagesExtraSpice: Type.Optional(Type.Array(Type.String())),
	time: Type.Number({ description: 'Time cook' }),
	videoUrl: Type.String({ description: 'URL youtube' }),
	level: Type.Enum(LevelCook),
	mealKits: Type.Array(mealkitsRecipeRequestSchema)
});

export type RecipeCreateRequest = Static<typeof recipeCreateRequestSchema>;

export const recipeUpdateRequestSchema = Type.Object({
	name: Type.String(),
	category: Type.String(),
	steps: Type.String(),
	time: Type.Number(),
	level: Type.Enum(LevelCook),
	videoUrl: Type.String(),
	foodStyles: Type.Array(Type.String())
});

export type RecipeUpdateRequest = Static<typeof recipeUpdateRequestSchema>;
