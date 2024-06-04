import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OrderPayment } from './order-payment.entity';

@Entity({ name: 'payment' })
export class Payment {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	name!: string;

	@OneToMany(() => OrderPayment, (orderPayment) => orderPayment.payment)
	orderPayments!: OrderPayment[];
}
