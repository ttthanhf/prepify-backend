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
import { Rel } from '@mikro-orm/core';

@Entity({ tableName: 'batch' })
export class Batch {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@Property()
	datetime!: Date;

	@ManyToOne({ entity: () => User })
	user!: Rel<User>;

	@ManyToOne({ entity: () => Area })
	area!: Rel<Area>;

	@OneToMany('OrderBatch', 'batch')
	orderBatches = new Collection<OrderBatch>(this);
}
