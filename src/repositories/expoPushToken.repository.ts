import { ExpoPushToken } from '~entities/expo-push-token.entity';
import { BaseRepository } from './base.repository';

class ExpoPushTokenRepository extends BaseRepository<ExpoPushToken> {
	constructor() {
		super(ExpoPushToken);
	}
}

export default new ExpoPushTokenRepository();
