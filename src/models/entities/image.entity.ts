import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ImageType } from '~constants/image.constant';

@Entity({ name: 'image' })
export class Image {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	url!: string;

	@Column({
		enum: ImageType
	})
	type!: string;

	@Column()
	entityId!: string;
}
