import { User } from './user.entity';
import { Area } from './area.entity';
import { OrderBatch } from './order-batch.entity';
import { v4 as uuidv4 } from 'uuid';
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	Relation
} from 'typeorm';
import { BatchStatus } from '~constants/batchstatus.constant';

@Entity({ name: 'batch' })
export class Batch {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column({
		type: 'datetime'
	})
	datetime!: Date;

	@ManyToOne(() => User, (user) => user.batches, { nullable: true })
	user!: Relation<User>;

	@ManyToOne(() => Area, (area) => area.batches)
	area!: Relation<Area>;

	@OneToMany(() => OrderBatch, (orderBatch) => orderBatch.batch)
	orderBatches!: OrderBatch[];

	@Column({
		type: 'enum',
		enum: BatchStatus
	})
	status!: BatchStatus;
}
