export const createUniqueTrackingNumber = (): string => {
	const prefix = 'PREP';
	//combining the last 10 digits of current timestamp with a random 3-digit number.
	const uniqueNumber = `${Date.now().toString().slice(-10)}${Math.floor(
		Math.random() * 1000
	)
		.toString()
		.padStart(3, '0')}`;
	return `${prefix}${uniqueNumber}`;
};
