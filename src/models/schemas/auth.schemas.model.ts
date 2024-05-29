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
			.default('qwe123@gmail.com')
	)
	.prop(
		'password',
		S.string()
			.required()
			.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/)
			.default('Password123!')
	);

const loginSchemas: FastifySchema = {
	body: loginObj.valueOf()
};

const registerObj = S.object()
	.prop('fullname', S.string().required().default('Nguyen Van A'))
	.prop(
		'phone',
		S.string()
			.required()
			.pattern(/^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})$/)
			.default('0909990099')
	)
	.extend(loginObj);

const registerSchemas: FastifySchema = {
	body: registerObj.valueOf()
};

const googleOauth2Obj = S.object().prop('code', S.string().required());

const googleOauth2Schemas: FastifySchema = {
	body: googleOauth2Obj.valueOf()
};

const forgotPasswordObj = S.object().prop(
	'email',
	S.string()
		.required()
		.pattern(
			/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
		)
		.default('qwe123@gmail.com')
);

const forgotPasswordSchemas: FastifySchema = {
	body: forgotPasswordObj.valueOf()
};

const verifyForgotPasswordObj = S.object().prop('token', S.string().required());

const verifyForgotPasswordSchemas: FastifySchema = {
	body: verifyForgotPasswordObj
};

const resetPasswordObj = S.object()
	.prop('token', S.string().required())
	.prop(
		'password',
		S.string()
			.required()
			.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/)
			.default('Password123!')
	);

const resetPasswordSchemas: FastifySchema = {
	body: resetPasswordObj.valueOf()
};

export default {
	loginSchemas,
	registerSchemas,
	googleOauth2Schemas,
	forgotPasswordSchemas,
	verifyForgotPasswordSchemas,
	resetPasswordSchemas
};
