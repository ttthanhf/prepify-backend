import { _Object } from '@aws-sdk/client-s3';
import { Redis, RedisKey } from 'ioredis';

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

	async setImagesRecipes(images: object) {
		return await this.redis.set('images-recipes', JSON.stringify(images));
	}

	async getImagesRecipes(): Promise<_Object[] | undefined | null> {
		const images = await this.redis.get('images-recipes');
		if (images) {
			return JSON.parse(images);
		}
		return null;
	}

	async removeImagesRecipes() {
		return await this.redis.del('images-recipes');
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
