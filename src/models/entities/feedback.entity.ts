import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
	Relation
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OrderDetail } from './order-detail.entity';

@Entity({ name: 'feedback' })
export class Feedback {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	content!: string;

	@Column()
	rating!: number;

	@OneToOne(() => OrderDetail, (orderDetail) => orderDetail.feedback)
	@JoinColumn()
	orderDetail!: Relation<OrderDetail>;

	@Column({
		type: 'datetime'
	})
	createdAt!: Date;
}
