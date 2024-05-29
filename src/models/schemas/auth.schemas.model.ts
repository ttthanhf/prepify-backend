import S from 'fluent-json-schema';
import { FastifySchema } from 'fastify/types/schema';
import { Pattern } from '~constants/pattern.constant';

const loginObj = S.object()
	.additionalProperties(false)
	.prop(
		'email',
		S.string()
			.required()
			.pattern(Pattern.EMAIL_REGEX)
			.default('qwe123@gmail.com')
	)
	.prop(
		'password',
		S.string()
			.required()
			.pattern(Pattern.PASSWORD_REGEX)
			.default('Password123!')
	);

const loginSchemas: FastifySchema = {
	body: loginObj.valueOf()
};

const registerObj = S.object()
	.prop('fullname', S.string().required().default('Nguyen Van A'))
	.prop(
		'phone',
		S.string().required().pattern(Pattern.PHONE_REGEX).default('0909990099')
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
	S.string().required().pattern(Pattern.EMAIL_REGEX).default('qwe123@gmail.com')
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
			.pattern(Pattern.PASSWORD_REGEX)
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
