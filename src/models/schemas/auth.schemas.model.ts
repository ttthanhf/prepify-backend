import S from 'fluent-json-schema';
import { FastifySchema } from 'fastify/types/schema';

const loginObj = S.object()
	.additionalProperties(false)
	.prop(
		'email',
		S.string()
			.required()
			.pattern(
				/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
			)
	)
	.prop(
		'password',
		S.string()
			.required()
			.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/)
	);

const loginSchemas: FastifySchema = {
	body: loginObj.valueOf()
};

const registerObj = S.object()
	.prop('fullname', S.string().required())
	.prop(
		'phone',
		S.string()
			.required()
			.pattern(/^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})$/)
	)
	.extend(loginObj);

const registerSchemas: FastifySchema = {
	body: registerObj.valueOf()
};

export default {
	loginSchemas,
	registerSchemas
};
