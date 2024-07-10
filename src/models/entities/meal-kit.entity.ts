import { Recipe } from './recipe.entity';
import { OrderDetail } from './order-detail.entity';
import { v4 as uuidv4 } from 'uuid';
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	Relation
} from 'typeorm';
import { ExtraSpice } from './extra-spice.entity';

@Entity({ name: 'meal_kit' })
export class MealKit {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	serving!: number;

	@Column()
	price!: number;

	@Column({
		type: 'boolean'
	})
	status!: boolean;

	@ManyToOne(() => Recipe, (recipe) => recipe.mealKits)
	recipe!: Relation<Recipe>;

	@OneToMany(() => OrderDetail, (orderDetail) => orderDetail.mealKit)
	orderDetails!: OrderDetail[];

	@OneToOne(() => ExtraSpice, (extraSpice) => extraSpice.mealKit)
	extraSpice!: Relation<ExtraSpice> | null;
}
