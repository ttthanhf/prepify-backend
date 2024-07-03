import { Static, Type } from '@sinclair/typebox';
import { OrderStatus } from '~constants/orderstatus.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';

export const orderModeratorQueryGetRequestSchema = Type.Object({
	pageSize: Type.Optional(Type.Number()),
	pageIndex: Type.Optional(Type.Number()),
	orderBy: Type.Optional(Type.Enum(OrderBy)),
	sortBy: Type.Optional(Type.Enum(SortBy)), // deliveredBy | status | orderDate
	search: Type.Optional(Type.String()), // search by orderCode | deliveredBy [key: search]
	area: Type.Optional(Type.String()), // filter by area [key: area]
	status: Type.Optional(Type.Enum(OrderStatus)) // filter by status [key: status]
});

export type orderModeratorQueryGetRequest = Static<
	typeof orderModeratorQueryGetRequestSchema
>;
