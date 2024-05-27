export interface LoginRequest {
	email: string;
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
