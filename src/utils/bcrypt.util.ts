import bcrypt from 'bcrypt';

const saltRounds = 10;

async function hash(rawData: string) {
	return bcrypt.hashSync(rawData, saltRounds);
}

async function compare(rawData: string, hashedData: string) {
	return bcrypt.compareSync(rawData, hashedData);
}

export default { hash, compare };
