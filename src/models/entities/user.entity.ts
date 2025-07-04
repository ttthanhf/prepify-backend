import { Role } from '~constants/role.constant';
import { Customer } from './customer.entity';
import { Batch } from './batch.entity';
import { Area } from './area.entity';
import { v4 as uuidv4 } from 'uuid';
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	Relation
} from 'typeorm';
import { ExpoPushToken } from './expo-push-token.entity';
import { DEFAULT_IMAGE } from '~constants/default.constant';

@Entity({ name: 'user' })
export class User {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	password!: string;

	@Column()
	email!: string;

	@Column({
		type: 'date'
	})
	dateOfBirth?: Date;

	@Column()
	phone!: string;

	@Column()
	fullname!: string;

	@Column()
	address?: string;

	@Column({
		type: 'enum',
		enum: Role
	})
	role!: Role;

	@Column()
	identityCard?: string;

	@OneToOne(() => Customer, (customer) => customer.user)
	customer?: Relation<Customer>;

	@OneToMany(() => Batch, (batch) => batch.user)
	batches!: Batch[];

	@ManyToOne(() => Area, (area) => area.users)
	area?: Relation<Area>;

	@OneToMany(() => ExpoPushToken, (expoPushToken) => expoPushToken.user)
	expoPushTokens!: ExpoPushToken[];

	hasPassword!: boolean;

	image: string = DEFAULT_IMAGE;
}
