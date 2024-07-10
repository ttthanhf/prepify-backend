import { Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { Customer } from './customer.entity';
import { Ingredient } from './ingredient.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'restrict_ingredient' })
export class RestrictIngredient {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@ManyToOne(() => Ingredient, (ingredient) => ingredient.restrictIngredients)
	ingredient!: Relation<Ingredient>;

	@ManyToOne(() => Customer, (customer) => customer.restrictIngredients)
	customer!: Relation<Customer>;
}
