import { Static, Type } from '@sinclair/typebox';
import { OrderStatus } from '~constants/orderstatus.constant';

export const orderShipperGetRequestSchema = Type.Object({
	status: Type.Optional(Type.Enum(OrderStatus))
});

export type OrderShipperGetRequest = Static<
	typeof orderShipperGetRequestSchema
>;

export const orderShipperUpdateRequestSchema = Type.Object({
	status: Type.Enum(OrderStatus)
});

export type OrderShipperUpdateRequest = Static<
	typeof orderShipperUpdateRequestSchema
>;
