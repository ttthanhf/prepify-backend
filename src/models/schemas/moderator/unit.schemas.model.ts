import { Static, Type } from '@sinclair/typebox';
import { OrderBy, SortBy } from '~constants/sort.constant';

export const unitModeratorQueryGetRequestSchema = Type.Object({
	pageSize: Type.Optional(Type.Number()),
	pageIndex: Type.Optional(Type.Number()),
	orderBy: Type.Optional(Type.Enum(OrderBy)),
	sortBy: Type.Optional(Type.Enum(SortBy)),
	searchUnit: Type.Optional(Type.String())
});

export type unitModeratorQueryGetRequest = Static<
	typeof unitModeratorQueryGetRequestSchema
>;
