import {
	Collection,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	Property
} from '@mikro-orm/core';
import { User } from './user.entity';
import { Area } from './area.entity';
import { OrderBatch } from './order-batch.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'batch' })
export class Batch {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@Property()
	datetime!: Date;

	@ManyToOne()
	user!: User;

	@ManyToOne()
	area!: Area;

	@OneToMany({ mappedBy: 'batch' })
	orderBatches = new Collection<OrderBatch>(this);
}
