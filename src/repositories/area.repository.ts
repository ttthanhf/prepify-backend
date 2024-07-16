import { Area } from '~models/entities/area.entity';
import { BaseRepository } from './base.repository';

class AreaRepository extends BaseRepository<Area> {
	constructor() {
		super(Area);
	}
}

export default new AreaRepository();
