import { Static, Type } from '@sinclair/typebox';
import { BatchStatus } from '~constants/batchstatus.constant';

export const batchShipperUpdateRequestSchema = Type.Object({
	status: Type.Optional(Type.Enum(BatchStatus))
});

export type BatchShipperUpdateRequest = Static<
	typeof batchShipperUpdateRequestSchema
>;
