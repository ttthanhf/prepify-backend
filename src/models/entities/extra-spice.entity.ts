import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
	Relation
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { MealKit } from './meal-kit.entity';

@Entity({ name: 'extra_spice' })
export class ExtraSpice {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	name!: string;

	@Column()
	price!: number;

	@OneToOne(() => MealKit, (mealkit) => mealkit.extraSpice)
	@JoinColumn()
	mealKit!: Relation<MealKit>;
}
