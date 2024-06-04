import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { Customer } from './customer.entity';
import { Ingredient } from './ingredient.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'customer_ingredient' })
export class CustomerIngredient {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@ManyToOne(() => Customer, (customer) => customer.customerIngredients)
	customer!: Relation<Customer>;

	@ManyToOne(() => Ingredient, (ingredient) => ingredient.customerIngredients)
	ingredient!: Relation<Ingredient>;

	@Column()
	note?: string; // optional field
}
