import { BaseRepository } from './base.repository';
import { ExtraSpice } from '~models/entities/extra-spice.entity';

class ExtraSpiceRepository extends BaseRepository<ExtraSpice> {
	constructor() {
		super(ExtraSpice);
	}
}

export default new ExtraSpiceRepository();
