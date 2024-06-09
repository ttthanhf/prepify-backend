import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	Relation
} from 'typeorm';
import { Customer } from './customer.entity';
import { Ingredient } from './ingredient.entity';

@Entity({ name: 'customer_ingredient' })
export class CustomerIngredient {
	@PrimaryColumn()
	customer_id!: string;

	@PrimaryColumn()
	ingredient_id!: string;

	@ManyToOne(() => Customer, (customer) => customer.customerIngredients)
	customer!: Relation<Customer>;

	@ManyToOne(() => Ingredient, (ingredient) => ingredient.customerIngredients)
	@JoinColumn({ name: 'ingredient_id' })
	ingredient!: Relation<Ingredient>;

	@Column()
	note?: string; // optional field
}
