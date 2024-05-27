function extractAuthorization(headers: any) {
	return headers?.authorization || null;
}

export default {
	extractAuthorization
};
