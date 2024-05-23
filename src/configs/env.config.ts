import envSchema from 'env-schema';
import jwtSchemas from '~models/schemas/jwt.schemas.model';
import { EnvConfig } from '~types/jwt.type';

const envConfig = envSchema<EnvConfig>({
	schema: jwtSchemas,
	dotenv: true,
	expandEnv: true
});

export default envConfig;
