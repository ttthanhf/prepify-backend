import {
	AccessToken,
	AuthorizationCode,
	AuthorizationTokenConfig
} from 'simple-oauth2';
import googleOauth2Config from '~configs/google.oauth2.config';
import { FastifyRequest } from 'fastify';
import stringUtil from './string.util';
import envConfig from '~configs/env.config';
import { google_user } from '~types/oauth2.type';

const client = new AuthorizationCode(
	googleOauth2Config.GOOGLE_OAUTH2_CODE_CONFIG
);

function getUrlGoogleLogin() {
	return client.authorizeURL(googleOauth2Config.GOOGLE_OAUTH2_URL_CONFIG);
}

async function getUserInfo(
	req: FastifyRequest<{ Querystring: AuthorizationTokenConfig }>
): Promise<google_user> {
	const { code, scope } = req.query;
	const access_token: AccessToken = await client.getToken({
		code,
		scope,
		redirect_uri:
			stringUtil.ensureTrailingSlash(envConfig.SERVER_DOMAIN) +
			'login/google/callback'
	});
	return fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
		headers: {
			Authorization: `Bearer ${access_token.token.access_token}`
		}
	})
		.then((a) => a.json())
		.then((result) => {
			return result;
		});
}

export default {
	getUrlGoogleLogin,
	getUserInfo
};
