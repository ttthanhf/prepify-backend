import {
	Collection,
	Entity,
	OneToMany,
	PrimaryKey,
	Property
} from '@mikro-orm/core';
import { Batch } from './batch.entity';
import { Order } from './order.entity';
import { User } from './user.entity';

@Entity({ tableName: 'area' })
export class Area {
	@PrimaryKey()
	@Property({ autoincrement: true, primary: true })
	id!: number;

	@Property()
	name!: string;

	@Property()
	price!: number;

	@OneToMany({ mappedBy: 'area' })
	batches = new Collection<Batch>(this);

	@OneToMany({ mappedBy: 'area' })
	orders = new Collection<Order>(this);

	@OneToMany({ mappedBy: 'area' })
	users = new Collection<User>(this);
}
