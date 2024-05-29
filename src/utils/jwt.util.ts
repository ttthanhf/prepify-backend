import { createSigner, createDecoder, createVerifier } from 'fast-jwt';
import envConfig from '~configs/env.config';
import JWT_CONFIG from '~configs/jwt.config';

function sign(
	payload: object,
	expiresIn: number | string = envConfig.JWT_EXPIRE
) {
	const signSync = createSigner({
		...JWT_CONFIG,
		expiresIn: expiresIn
	});
	return signSync(payload);
}

function decode(token: string | number) {
	return createDecoder({ complete: true });
}

function verify(token: string | number) {
	const verifySync = createVerifier(JWT_CONFIG);
	try {
		return verifySync(String(token));
	} catch (e) {
		return null;
	}
}

export default {
	sign,
	decode,
	verify
};
