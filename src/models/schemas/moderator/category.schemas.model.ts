import { Static, Type } from '@sinclair/typebox';
import { OrderBy, SortBy } from '~constants/sort.constant';

export const categoryModeratorQueryGetRequestSchema = Type.Object({
	pageSize: Type.Optional(Type.Number()),
	pageIndex: Type.Optional(Type.Number()),
	orderBy: Type.Optional(Type.Enum(OrderBy)),
	sortBy: Type.Optional(Type.Enum(SortBy)),
	searchCategory: Type.Optional(Type.String())
});

export type categoryModeratorQueryGetRequest = Static<
	typeof categoryModeratorQueryGetRequestSchema
>;

export const categoryModeratorQueryCreateRequestSchema = Type.Object({
	name: Type.String()
});

export type categoryModeratorQueryCreateRequest = Static<
	typeof categoryModeratorQueryCreateRequestSchema
>;
