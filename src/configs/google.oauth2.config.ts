import stringUtil from '../utils/string.util';
import envConfig from './env.config';
import crypto from 'crypto';

const GOOGLE_OAUTH2_CODE_CONFIG = {
	client: {
		id: envConfig.OAUTH2_GOOGLE_ID,
		secret: envConfig.OAUTH2_GOOGLE_SECRET
	},
	auth: {
		authorizeHost: 'https://accounts.google.com',
		authorizePath: '/o/oauth2/v2/auth',
		tokenHost: 'https://www.googleapis.com',
		tokenPath: '/oauth2/v4/token'
	}
};

const GOOGLE_OAUTH2_URL_CONFIG = {
	redirect_uri:
		stringUtil.ensureTrailingSlash(envConfig.SERVER_DOMAIN) +
		'login/google/callback',
	scope: 'email profile',
	state: crypto.randomBytes(16).toString('hex')
};

export default {
	GOOGLE_OAUTH2_CODE_CONFIG,
	GOOGLE_OAUTH2_URL_CONFIG
};
