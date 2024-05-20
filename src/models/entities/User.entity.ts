import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { Role } from '../../constants/role.constant';

@Entity({ tableName: 'users' })
export class User {
	@PrimaryKey()
	@Property({ autoincrement: true, primary: true })
	id!: number;

	@Property()
	password!: string;

	@Property()
	phone!: string;

	@Property()
	fullname!: string;

	@Property()
	address!: string;

	@Enum(() => Role)
	role!: Role;
}
