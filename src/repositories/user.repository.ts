import { User } from '~entities/user.entity';
import mikroUtil from '~utils/mikro.util';
import { FilterQuery } from '@mikro-orm/mariadb';

class UserRepository {
	async findOneUser(field: FilterQuery<User>) {
		return await mikroUtil.em.findOne(User, field);
	}

	async createNewUser(user: User) {
		return await mikroUtil.em.persistAndFlush(user);
	}
}

export default new UserRepository();
