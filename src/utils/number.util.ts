function generateRandomNumber(size: number) {
	const min = Math.pow(10, size - 1);
	const max = Math.pow(10, size) - 1;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
	generateRandomNumber
};
