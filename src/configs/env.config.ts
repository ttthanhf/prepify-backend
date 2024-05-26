import envSchemas from '~models/schemas/env.schemas.model';
import envSchema from 'env-schema';
import { EnvConfig } from '~types/env.type';

const envConfig = envSchema<EnvConfig>({
	schema: envSchemas,
	dotenv: true,
	expandEnv: true
});

export default envConfig;
