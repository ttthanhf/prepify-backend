import { Static, Type } from '@sinclair/typebox';
import { DeliveryMethod } from '~constants/deliverymethod.constant';

export const orderCreateRequestSchema = Type.Object({
	paymentId: Type.String(),
	areaId: Type.String(),
	address: Type.String(),
	note: Type.Union([Type.String(), Type.Null()]),
	deliveryMethod: Type.Enum(DeliveryMethod),
	phone: Type.String()
});

export type OrderCreateRequest = Static<typeof orderCreateRequestSchema>;
