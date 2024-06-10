function tryParseStringToJSON(str: string) {
	try {
		let result = JSON.parse(str);
		return result;
	} catch (e) {
		return str;
	}
}

function removeVietnameseTones(str: string) {
	str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
	return str;
}

export default {
	tryParseStringToJSON,
	removeVietnameseTones
};
