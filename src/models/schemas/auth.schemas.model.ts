import S from 'fluent-json-schema';
import { FastifySchema } from 'fastify/types/schema';
// import responseSchemasModel from './response.schemas.model';

const loginSchemas: FastifySchema = {
	body: S.object()
		.prop('phone', S.string().required().minLength(10).maxLength(10))
		.prop('password', S.string().required())
		.valueOf()
	// response: {
	// 	200: responseSchemasModel.responseSchemas
	// }
};
const registerSchemas: FastifySchema = {
	body: S.object()
		.prop('phone', S.string().required().minLength(10).maxLength(10))
		.prop('password', S.string().required())
		.valueOf()
	// response: {
	// 	200: responseSchemasModel.responseSchemas
	// }
};

export default {
	loginSchemas,
	registerSchemas
};
