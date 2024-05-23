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

@Entity({ tableName: 'batch' })
export class Batch {
	@PrimaryKey()
	@Property({ autoincrement: true, primary: true })
	id!: number;

	@Property()
	datetime!: Date;

	@ManyToOne()
	user!: User;

	@ManyToOne()
	area!: Area;

	@OneToMany({ mappedBy: 'batch' })
	orderBatches = new Collection<OrderBatch>(this);
}
