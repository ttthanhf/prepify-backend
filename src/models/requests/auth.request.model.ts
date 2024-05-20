export interface LoginRequest {
	phone: string;
	password: string;
}

export interface RegisterRequest {
	phone: string;
	password: string;
	date_of_birth: Date;
}
