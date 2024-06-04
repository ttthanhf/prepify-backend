import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'payment' })
export class Payment {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	name!: string;

	@OneToMany(() => Order, (order) => order.payment)
	orderPayments!: Order[];
}
