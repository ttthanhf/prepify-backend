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
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'area' })
export class Area {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@Property()
	name!: string;

	@Property()
	price!: number;

	@OneToMany({ mappedBy: 'area', entity: () => Batch })
	batches = new Collection<Batch>(this);

	@OneToMany({ mappedBy: 'area', entity: () => Order })
	orders = new Collection<Order>(this);

	@OneToMany({ mappedBy: 'area', entity: () => User })
	users = new Collection<User>(this);
}
