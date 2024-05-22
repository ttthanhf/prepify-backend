import { createSigner, createDecoder, createVerifier } from 'fast-jwt';
import JWT_CONFIG from '../configs/jwt.config';

function sign(payload: object) {
	const signSync = createSigner(JWT_CONFIG);
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
