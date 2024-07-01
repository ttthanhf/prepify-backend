import { BaseRepository } from './base.repository';
import { Unit } from '~models/entities/unit.entity';

class UnitRepository extends BaseRepository<Unit> {
	constructor() {
		super(Unit);
	}
}

export default new UnitRepository();
