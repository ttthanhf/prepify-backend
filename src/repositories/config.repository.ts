import { BaseRepository } from './base.repository';
import { Config } from '~models/entities/config.entity';

class ConfigRepository extends BaseRepository<Config> {
	constructor() {
		super(Config);
	}
}

export default new ConfigRepository();
