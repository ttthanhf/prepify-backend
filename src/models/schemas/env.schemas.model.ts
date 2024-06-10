import { Static, Type } from '@sinclair/typebox';

const envSchema = Type.Object({
	SERVER_PORT: Type.String(),
	SERVER_DOMAIN: Type.String(),
	MARIADB_HOST: Type.String(),
	MARIADB_USER: Type.String(),
	MARIADB_PASSWORD: Type.String(),
	MARIADB_DATABASE: Type.String(),
	MARIADB_CLIENTURL: Type.String(),
	MARIADB_PORT: Type.Number(),
	JWT_KEY: Type.String(),
	JWT_EXPIRE: Type.String(),
	JWT_ALGORITHM: Type.String(),
	OAUTH2_GOOGLE_ID: Type.String(),
	OAUTH2_GOOGLE_SECRET: Type.String(),
	OAUTH2_GOOGLE_REDIRECT: Type.String(),
	MAIL_USER: Type.String(),
	MAIL_PASSWORD: Type.String(),
	MAIL_EXPIRE: Type.String(),
	MAIL_REDIRECT: Type.String(),
	MAIL_REDIRECT_MOBILE: Type.String(),
	S3_BUCKET: Type.String(),
	S3_ID: Type.String(),
	S3_KEY: Type.String(),
	S3_REGION: Type.String(),
	S3_END_POINT: Type.String(),
	S3_HOST: Type.String(),
	LOG_LEVEL: Type.String(),
	ENVIROMENT: Type.String()
});

export type EnvSchema = Static<typeof envSchema>;

export default envSchema;
