import {
	Collection,
	Entity,
	Enum,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryKey,
	Property
} from '@mikro-orm/core';
import { Role } from '../../constants/role.constant';
import { Customer } from './customer.entity';
import { Batch } from './batch.entity';
import { Area } from './area.entity';

@Entity({ tableName: 'user' })
export class User {
	@PrimaryKey()
	@Property({ autoincrement: true, primary: true })
	id!: number;

	@Property({ hidden: true })
	password!: string;

	@Property()
	email!: string;

	@Property()
	phone!: string;

	@Property()
	fullname!: string;

	@Property()
	address!: string;

	@Enum(() => Role)
	role!: Role;

	@Property()
	avatar?: string;

	@OneToOne({ mappedBy: 'user' })
	customer?: Customer;

	@OneToMany({ mappedBy: 'user' })
	batches = new Collection<Batch>(this);

	@ManyToOne()
	area!: Area;
}
