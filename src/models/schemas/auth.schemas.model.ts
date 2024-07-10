import { Pattern } from '~constants/pattern.constant';
import { Static, Type } from '@sinclair/typebox';

const BaseAuthSchema = {
	email: Type.String({
		pattern: Pattern.EMAIL_REGEX.source,
		default: '-@gmail.com'
	}),
	phone: Type.String({
		pattern: Pattern.PHONE_REGEX.source,
		default: '0909990099'
	}),
	password: Type.String({
		pattern: Pattern.PASSWORD_REGEX.source,
		default: 'Password123!'
	})
};

export const loginRequestSchema = Type.Object({
	password: BaseAuthSchema.password,
	email: Type.Optional(BaseAuthSchema.email),
	phone: Type.Optional(BaseAuthSchema.phone)
});

export type LoginRequest = Static<typeof loginRequestSchema>;

export const registerRequestSchema = Type.Object({
	fullname: Type.String({ default: 'Nguyen Van A' }),
	...BaseAuthSchema
});

export type RegisterRequest = Static<typeof registerRequestSchema>;

export const googleOauth2Schema = Type.Object({
	code: Type.String()
});

export type GoogleOauth2 = Static<typeof googleOauth2Schema>;

export const forgotPasswordSchema = Type.Object({
	email: BaseAuthSchema.email
});

export type ForgotPassword = Static<typeof forgotPasswordSchema>;

export const verifyForgotPasswordSchema = Type.Object({
	token: Type.String()
});

export type VerifyForgotPassword = Static<typeof verifyForgotPasswordSchema>;

export const resetPasswordSchema = Type.Object({
	token: Type.String(),
	password: BaseAuthSchema.password
});

export type ResetPassword = Static<typeof resetPasswordSchema>;

export const changePasswordSchema = Type.Object({
	oldPassword: Type.String(),
	newPassword: Type.String()
});

export type ChangePassword = Static<typeof changePasswordSchema>;
