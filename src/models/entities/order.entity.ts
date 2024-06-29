import { Customer } from './customer.entity';
import { OrderDetail } from './order-detail.entity';
import { OrderBatch } from './order-batch.entity';
import { Payment } from './payment.entity';
import { OrderStatus } from '~constants/orderstatus.constant';
import { Area } from './area.entity';
import { v4 as uuidv4 } from 'uuid';
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	Relation
} from 'typeorm';
import { OrderPayment } from './order-payment.entity';

@Entity({ name: 'order' })
export class Order {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	address!: string;

	@Column({
		type: 'date'
	})
	datetime!: Date;

	@Column()
	totalPrice!: number;

	@Column()
	feedback?: string;

	@Column()
	rate?: number;

	@Column()
	phone!: string;

	// @Column()
	// transactionId!: string; // optional in the future

	@Column({
		nullable: true
	})
	note?: string;

	@Column({
		type: 'enum',
		enum: OrderStatus
	})
	status!: OrderStatus;

	@ManyToOne(() => Customer, (customer) => customer.orders)
	customer!: Relation<Customer>;

	@OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
	orderDetails!: OrderDetail[];

	@OneToMany(() => OrderBatch, (orderBatch) => orderBatch.order)
	orderBatches!: OrderBatch[];

	@ManyToOne(() => Payment, (payment) => payment.orderPayments)
	payment!: Relation<Payment>;

	@OneToMany(() => OrderPayment, (orderPayment) => orderPayment.order)
	orderPayments!: OrderPayment[];

	@ManyToOne(() => Area, (area) => area.orders)
	area!: Relation<Area>;
}
