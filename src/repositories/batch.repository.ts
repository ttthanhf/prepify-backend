import { Batch } from '~models/entities/batch.entity';
import { BaseRepository } from './base.repository';

class BatchRepository extends BaseRepository<Batch> {
	constructor() {
		super(Batch);
	}
}

export default new BatchRepository();
