import { _Object } from '@aws-sdk/client-s3';
import { Redis, RedisKey } from 'ioredis';
import { Customer } from '~models/entities/customer.entity';

const recoveryPasswordTail = '-recovery-password';

class RedisUtil {
	redis!: Redis;
	emailRecoveryBlackList: Object = {};
	constructor() {
		if (!this.redis) {
			this.redis = new Redis();
			console.log('Redis init successfully !');
		}
	}

	async setCheckout(customer: Customer, checkout: any) {
		return await this.redis.set(
			'checkout-' + customer.id,
			JSON.stringify(checkout),
			'EX',
			60 * 60
		);
	}

	async getCheckout(customer: Customer) {
		const checkout = await this.redis.get('checkout-' + customer.id);
		if (checkout) {
			return JSON.parse(checkout);
		}
		return null;
	}

	async removeCheckout(customer: Customer) {
		return await this.redis.del('checkout-' + customer.id);
	}

	async setEmailRecoveryWhiteList(email: RedisKey) {
		return await this.redis.set(
			email + recoveryPasswordTail,
			'stored',
			'EX',
			60,
			'NX'
		);
	}

	async removeEmailRecoveryWhiteList(email: RedisKey) {
		return await this.redis.del(email + recoveryPasswordTail);
	}

	async getEmailRecoveryWhiteList(email: RedisKey) {
		return await this.redis.get(email + recoveryPasswordTail);
	}

	async setTokenRecoveryPasswordWhiteList(token: RedisKey) {
		return await this.redis.set(token, 'stored', 'EX', 60 * 5, 'NX');
	}

	async removeTokenRecoveryPasswordWhiteList(token: RedisKey) {
		return await this.redis.del(token);
	}

	async getTokenRecoveryPasswordWhiteList(token: RedisKey) {
		return await this.redis.get(token);
	}
}

export default new RedisUtil();
