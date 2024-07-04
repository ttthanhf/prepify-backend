import { Static, Type } from '@sinclair/typebox';
import { OrderBy, SortBy } from '~constants/sort.constant';

export const accountAdminQueryGetRequestSchema = Type.Object({
	pageSize: Type.Optional(Type.Number()),
	pageIndex: Type.Optional(Type.Number()),
	orderBy: Type.Optional(Type.Enum(OrderBy)),
	sortBy: Type.Optional(Type.Enum(SortBy)),
	search: Type.Optional(Type.String()),
	role: Type.Optional(Type.String()),
	area: Type.Optional(Type.String())
});

export type AccountAdminQueryGetRequest = Static<
	typeof accountAdminQueryGetRequestSchema
>;
