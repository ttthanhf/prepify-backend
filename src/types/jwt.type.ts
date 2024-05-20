import { Algorithm } from 'fast-jwt';

export interface EnvConfig {
	SERVER_PORT: number;
	MARIADB_HOST: string;
	MARIADB_USER: string;
	MARIADB_PASSWORD: string;
	MARIADB_DATABASE: string;
	MARIADB_PORT: number;
	MARIADB_CLIENTURL: string;
	JWT_KEY: string;
	JWT_EXPIRE: string;
	JWT_ALGORITHM: Algorithm;
}
