import { Static, Type } from '@sinclair/typebox';
import { OrderBy, SortBy } from '~constants/sort.constant';

export const mealKitModeratorCreateRequestSchema = Type.Array(
	Type.Object({
		recipeId: Type.String(),
		mealKits: Type.Array(
			Type.Object({
				serving: Type.Number(),
				price: Type.Number(),
				extraSpice: Type.Optional(
					Type.Object({
						name: Type.String(),
						price: Type.Number()
					})
				)
			})
		)
	})
);

export type MealKitModeratorCreateRequest = Static<
	typeof mealKitModeratorCreateRequestSchema
>;

export const mealKitModeratorGetRequestSchema = Type.Object({
	search: Type.Optional(Type.String()),
	orderBy: Type.Optional(Type.Enum(OrderBy)),
	sortBy: Type.Optional(Type.Enum(SortBy)),
	pageSize: Type.Optional(Type.Number()),
	pageIndex: Type.Optional(Type.Number()),
	status: Type.Optional(Type.Boolean())
});

export type MealKitModeratorGetRequest = Static<
	typeof mealKitModeratorGetRequestSchema
>;

export const mealKitModeratorUpdateRequestSchema = Type.Object({
	serving: Type.Number(),
	price: Type.Number(),
	extraSpice: Type.Optional(
		Type.Object({
			name: Type.String(),
			price: Type.Number()
		})
	)
});

export type MealKitModeratorUpdateRequest = Static<
	typeof mealKitModeratorUpdateRequestSchema
>;
