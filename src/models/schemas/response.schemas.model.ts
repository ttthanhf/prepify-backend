import S from 'fluent-json-schema';
import { FastifySchema } from 'fastify/types/schema';

const responseSchemas: FastifySchema = {
	body: S.object()
		.prop('statusCode', S.number())
		.prop('message', S.string())
		.prop('data', S.object())
		.valueOf()
};

export default {
	responseSchemas
};
