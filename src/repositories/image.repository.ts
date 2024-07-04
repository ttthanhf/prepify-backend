import { Image } from '~models/entities/image.entity';
import { BaseRepository } from './base.repository';

class ImageRepository extends BaseRepository<Image> {
	constructor() {
		super(Image);
	}
}

export default new ImageRepository();
