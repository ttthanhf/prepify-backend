import { SignerOptions } from 'fast-jwt';
import envConfig from './env.config';

const JWT_CONFIG: Partial<SignerOptions & { key: string }> = {
	key: envConfig.JWT_KEY,
	algorithm: envConfig.JWT_ALGORITHM
};

export default JWT_CONFIG;
