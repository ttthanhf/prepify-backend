import userRepository from '~repositories/user.repository';
import headerUtil from './header.util';
import jwtUtil from './jwt.util';
import customerRepository from '~repositories/customer.repository';

async function getUserByTokenInHeader(headers: any) {
	const token = headerUtil.extractAuthorization(headers);
	const userId = jwtUtil.verify(token).userId;
	const user = await userRepository.findOneBy({
		id: userId
	});
	return user;
}

async function getCustomerByTokenInHeader(headers: any) {
	const user = await getUserByTokenInHeader(headers);
	const customer = await customerRepository.findOneBy({
		user: {
			id: user?.id
		}
	});
	return customer;
}

export default {
	getUserByTokenInHeader,
	getCustomerByTokenInHeader
};
