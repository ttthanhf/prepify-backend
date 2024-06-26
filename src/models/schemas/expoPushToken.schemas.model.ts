import { Static, Type } from '@sinclair/typebox';

export const expoPushTokenSaveRequestSchema = Type.Object({
	pushToken: Type.String(),
	deviceId: Type.String(),
	deviceInfo: Type.Optional(Type.String())
});

export type ExpoPushTokenSaveRequest = Static<
	typeof expoPushTokenSaveRequestSchema
>;
