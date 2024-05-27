import {
	AccessToken,
	AuthorizationCode,
	AuthorizationTokenConfig
} from 'simple-oauth2';
import googleOauth2Config from '~configs/google.oauth2.config';
import { FastifyRequest } from 'fastify';
import envConfig from '~configs/env.config';
import { google_user } from '~types/oauth2.type';
import { GoogleOauth2Request } from '@/models/requests/auth.request.model';

const client = new AuthorizationCode(
	googleOauth2Config.GOOGLE_OAUTH2_CODE_CONFIG
);

function getUrlGoogleLogin() {
	return client.authorizeURL(googleOauth2Config.GOOGLE_OAUTH2_URL_CONFIG);
}

async function getUserInfo(
	req: FastifyRequest<{ Querystring: AuthorizationTokenConfig }>
): Promise<google_user> {
	const { code }: GoogleOauth2Request = req.body as GoogleOauth2Request;

	const access_token: AccessToken = await client.getToken({
		code,
		scope: 'email profile openid',
		redirect_uri: envConfig.OAUTH2_GOOGLE_REDIRECT
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
