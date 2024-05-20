import { createSigner, createDecoder, createVerifier } from 'fast-jwt';
import JWT_CONFIG from '../configs/jwt.config';

async function sign(payload: object) {
	const signSync = createSigner(JWT_CONFIG);
	return signSync(payload);
}

async function decode(token: string) {
	return createDecoder({ complete: true });
}

async function verify(token: string) {
	const verifySync = createVerifier(JWT_CONFIG);
	return verifySync(token);
}

export default {
	sign,
	decode,
	verify
};
