import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'config' })
export class Config {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	type!: string;

	@Column()
	value!: number;
}
