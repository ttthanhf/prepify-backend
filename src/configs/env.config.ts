import envSchemas, { EnvSchema } from '~models/schemas/env.schemas.model';
import envSchema from 'env-schema';

const envConfig = envSchema<EnvSchema>({
	schema: envSchemas,
	dotenv: true,
	expandEnv: true
});

export default envConfig;
