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
import { Role } from '~constants/role.constant';
import { Customer } from './customer.entity';
import { Batch } from './batch.entity';
import { Area } from './area.entity';
import { v4 as uuidv4 } from 'uuid';
import { Rel } from '@mikro-orm/core';

@Entity({ tableName: 'user' })
export class User {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@Property({ hidden: true })
	password!: string;

	@Property()
	email!: string;

	@Property()
	dateOfBirth?: Date;

	@Property()
	phone!: string;

	@Property()
	fullname!: string;

	@Property()
	address?: string;

	@Enum(() => Role)
	role!: Role;

	@Property()
	avatar?: string;

	@OneToOne({ entity: () => Customer })
	customer?: Rel<Customer>;

	@OneToMany('Batch', 'user')
	batches = new Collection<Batch>(this);

	@ManyToOne({ entity: () => Area })
	area?: Rel<Area>;
}
