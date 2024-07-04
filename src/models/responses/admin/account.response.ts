import { Role } from '~constants/role.constant';

export class AccountAdminGetResponse {
	id!: string;
	area!: string;
	phone!: string;
	fullname!: string;
	role!: Role;
	email!: string;
	address!: string;
	avatar!: string;
}
