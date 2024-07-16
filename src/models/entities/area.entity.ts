import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Batch } from './batch.entity';
import { Order } from './order.entity';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'area' })
export class Area {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	name!: string;

	@Column()
	instantPrice!: number;

	@Column()
	standardPrice!: number;

	@OneToMany(() => Batch, (batch) => batch.area)
	batches!: Batch[];

	@OneToMany(() => Order, (order) => order.area)
	orders!: Order[];

	@OneToMany(() => User, (user) => user.area)
	users!: User[];
}
