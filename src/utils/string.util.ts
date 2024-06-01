function tryParseStringToJSON(str: string) {
	try {
		let result = JSON.parse(str);
		return result;
	} catch (e) {
		return str;
	}
}

export default {
	tryParseStringToJSON
};
