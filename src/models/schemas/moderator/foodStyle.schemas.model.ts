import { Static, Type } from '@sinclair/typebox';
import { OrderBy, SortBy } from '~constants/sort.constant';

export const foodStyleModeratorQueryGetRequestSchema = Type.Object({
	pageSize: Type.Optional(Type.Number()),
	pageIndex: Type.Optional(Type.Number()),
	orderBy: Type.Optional(Type.Enum(OrderBy)),
	sortBy: Type.Optional(Type.Enum(SortBy)),
	search: Type.Optional(Type.String()),
	type: Type.Optional(Type.String())
});

export type FoodStyleModeratorQueryGetRequest = Static<
	typeof foodStyleModeratorQueryGetRequestSchema
>;

export const foodStyleModeratorQueryCreateRequestSchema = Type.Object({
	title: Type.String(),
	name: Type.String()
});

export type FoodStyleModeratorQueryCreateRequest = Static<
	typeof foodStyleModeratorQueryCreateRequestSchema
>;

export const foodStyleModeratorQueryUpdateRequestSchema =
	foodStyleModeratorQueryCreateRequestSchema;

export type FoodStyleModeratorQueryUpdateRequest = Static<
	typeof foodStyleModeratorQueryUpdateRequestSchema
>;
