import { MariaDbDriver, defineConfig } from '@mikro-orm/mariadb';
import { User } from '~models/entities/user.entity';
import envConfig from './env.config';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export default defineConfig({
	driver: MariaDbDriver,
	entities: [User],
	entitiesTs: [User],
	host: envConfig.MARIADB_HOST,
	user: envConfig.MARIADB_USER,
	password: envConfig.MARIADB_PASSWORD,
	dbName: envConfig.MARIADB_DATABASE,
	port: envConfig.MARIADB_PORT,
	clientUrl: envConfig.MARIADB_CLIENTURL,
	metadataProvider: TsMorphMetadataProvider,
	validate: true,
	strict: true,
	validateRequired: false,
	pool: {
		min: 5,
		max: 20
	},
	debug: true
});
