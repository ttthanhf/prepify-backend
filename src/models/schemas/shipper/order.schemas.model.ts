import { Static, Type } from '@sinclair/typebox';
import { OrderStatus } from '~constants/orderstatus.constant';

export const orderShipperGetRequestSchema = Type.Object({
	status: Type.Optional(Type.String())
});

export type OrderShipperGetRequest = Static<
	typeof orderShipperGetRequestSchema
>;

export const orderShipperUpdateRequestSchema = Type.Object({
	status: Type.Enum(OrderStatus),
	note: Type.Optional(Type.String())
});

export type OrderShipperUpdateRequest = Static<
	typeof orderShipperUpdateRequestSchema
>;
