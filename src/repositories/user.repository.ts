import { User } from '../models/entities/User.entity';
import mikroUtil from '../utils/mikro.util';
import { EntityManager } from '@mikro-orm/mariadb';

class UserRepository {
	private em: EntityManager;

	constructor() {
		const orm = mikroUtil.getORM();
		this.em = orm.em.fork();
	}

	async findOneUserWithPhone(phone: string) {
		return await this.em.findOne(User, { phone });
	}

	async createNewUser(user: User) {
		return await this.em.persist(user).flush();
	}
}

export default new UserRepository();
