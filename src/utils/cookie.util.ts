function extract(headers: any) {
	const getCookie = headers.cookie;
	if (!getCookie) {
		return {};
	}

	const pairs = getCookie.split(';');
	const obj: { [key: string]: number | string } = {};

	pairs.forEach((pair: string) => {
		pair = pair.trim();
		const [key, value] = pair.split('=');
		if (key) {
			obj[key] = value;
		}
	});

	return obj;
}

export default {
	extract
};
