export interface LoginRequest {
	email: string;
	phone: string;
	password: string;
}

export interface RegisterRequest {
	phone: string;
	password: string;
	email: string;
	fullname: string;
}

export interface GoogleOauth2Request {
	code: string;
}

export interface ForgotPasswordRequest {
	email: string;
	redirect_url: string;
}

export interface ResetPasswordRequest {
	token: string;
	password: string;
}

export interface VerifyResetPasswordRequest {
	token: string;
}
