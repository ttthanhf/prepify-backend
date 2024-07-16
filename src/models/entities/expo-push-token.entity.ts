import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryColumn,
	Relation,
	UpdateDateColumn
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';

@Entity({ name: 'expo_push_token' })
export class ExpoPushToken {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@ManyToOne(() => User, (user) => user.expoPushTokens)
	user!: Relation<User>;

	@Column({ unique: true })
	deviceId!: string;

	@Column()
	pushToken!: string;

	@Column({ nullable: true })
	deviceInfo?: string;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt!: Date;
}
