import { Order } from './order.entity';
import { v4 as uuidv4 } from 'uuid';
import { Payment } from './payment.entity';
import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';

@Entity({ name: 'order_payment' })
export class OrderPayment {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@ManyToOne(() => Order, (order) => order.orderPayments)
	order!: Relation<Order>;

	@ManyToOne(() => Payment, (payment) => payment.orderPayments)
	payment!: Relation<Payment>;

	@Column()
	totalPrice!: number;

	@Column()
	transactionId?: string;
}
