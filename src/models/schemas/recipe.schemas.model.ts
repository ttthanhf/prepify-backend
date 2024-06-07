import S from 'fluent-json-schema';
import { FastifySchema } from 'fastify/types/schema';
import { Static, Type } from '@sinclair/typebox';
import { OrderBy, SortBy } from '~constants/sort.constant';

const recipeCreateObj = S.object()
	.prop('name', S.string().required())
	.prop(
		'ingredients',
		S.array()
			.items(
				S.object()
					.prop('ingredient_id', S.number().required())
					.prop('amount', S.number().required())
					.prop('unit_id', S.number().required())
			)
			.required()
	)
	.prop('category', S.number().required())
	.prop('foodStyle', S.array().items(S.number()).required())
	.prop('steps', S.string().required())
	.prop(
		'nutrition',
		S.array()
			.items(
				S.object()
					.prop('nutrition_id', S.number().required())
					.prop('amount', S.number().required())
					.prop('unit_id', S.number().required())
			)
			.required()
	)
	.prop('images', S.array().items(S.string()))
	.prop('time', S.number().required().description('Time cook'))
	.prop('video', S.string().description('URL youtube'))
	.prop('level', S.string().required());

const recipeCreateSchema: FastifySchema = {
	body: recipeCreateObj.valueOf()
};

const recipeUpdateObj = S.anyOf([
	S.object().prop('name', S.string().required()),
	S.object().prop(
		'ingredients',
		S.array()
			.items(
				S.object()
					.prop('ingredient_id', S.number())
					.prop('amount', S.number())
					.prop('unit_id', S.number())
			)
			.required()
	),
	S.object().prop('category', S.number().required()),
	S.object().prop('foodStyle', S.array().items(S.number()).required()),
	S.object().prop('steps', S.string().required()),
	S.object().prop(
		'nutrition',
		S.array()
			.items(
				S.object()
					.prop('nutrition_id', S.number())
					.prop('amount', S.number())
					.prop('unit_id', S.number())
			)
			.required()
	),
	S.object().prop('images', S.array().items(S.string()).required()),
	S.object().prop('time', S.number().required().description('Time cook')),
	S.object().prop('video', S.string().required().description('URL youtube')),
	S.object().prop('level', S.string().required())
]);

export const recipeQueryGetRequestSchema = Type.Object({
	pageSize: Type.Optional(Type.Number()),
	pageIndex: Type.Optional(Type.Number()),
	orderBy: Type.Optional(Type.Enum(OrderBy)),
	sortBy: Type.Optional(Type.Enum(SortBy)),
	foodStyle: Type.Optional(Type.String()),
	minPrice: Type.Optional(Type.Number()),
	maxPrice: Type.Optional(Type.Number()),
	searchRecipe: Type.Optional(Type.String()),
	minRating: Type.Optional(Type.Number()),
	maxRating: Type.Optional(Type.Number())
});

export type RecipeGetRequest = Static<typeof recipeQueryGetRequestSchema>;

export default {
	recipeCreateSchema,
	recipeCreateObj,
	recipeUpdateObj
};
