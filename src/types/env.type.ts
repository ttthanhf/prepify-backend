import { Algorithm } from 'fast-jwt';

export interface EnvConfig {
	SERVER_PORT: number;
	SERVER_DOMAIN: string;
	MARIADB_HOST: string;
	MARIADB_USER: string;
	MARIADB_PASSWORD: string;
	MARIADB_DATABASE: string;
	MARIADB_PORT: number;
	MARIADB_CLIENTURL: string;
	JWT_KEY: string;
	JWT_EXPIRE: string;
	JWT_ALGORITHM: Algorithm;
	OAUTH2_GOOGLE_ID: string;
	OAUTH2_GOOGLE_SECRET: string;
	OAUTH2_GOOGLE_REDIRECT: string;
	MAIL_USER: string;
	MAIL_PASSWORD: string;
	MAIL_EXPIRE: string;
	MAIL_REDIRECT: string;
	LOG_LEVEL: string;
}
