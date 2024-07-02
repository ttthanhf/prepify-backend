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

export const unitModeratorQueryCreateRequestSchema = Type.Object({
	name: Type.String()
});

export type unitModeratorQueryCreateRequest = Static<
	typeof unitModeratorQueryCreateRequestSchema
>;

export const unitModeratorQueryUpdateRequestSchema = Type.Object({
	name: Type.String()
});

export type unitModeratorQueryUpdateRequest = Static<
	typeof unitModeratorQueryUpdateRequestSchema
>;
