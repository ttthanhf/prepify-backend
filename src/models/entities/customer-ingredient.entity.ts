import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { Customer } from './customer.entity';
import { Ingredient } from './ingredient.entity';

@Entity({ name: 'customer_ingredient' })
export class CustomerIngredient {
	@PrimaryColumn()
	@ManyToOne(() => Customer, (customer) => customer.customerIngredients)
	customer!: Relation<Customer>;

	@PrimaryColumn()
	@ManyToOne(() => Ingredient, (ingredient) => ingredient.customerIngredients)
	ingredient!: Relation<Ingredient>;

	@Column()
	note?: string; // optional field
}
