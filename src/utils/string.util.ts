function ensureTrailingSlash(str: string) {
	if (str.endsWith('/')) {
		return str;
	} else {
		return str + '/';
	}
}

export default {
	ensureTrailingSlash
};
