import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { Customer } from './customer.entity';
import { Ingredient } from './ingredient.entity';

@Entity({ tableName: 'customer_ingredient' })
export class CustomerIngredient {
	@ManyToOne({ entity: () => Customer, primary: true })
	customer!: Rel<Customer>;

	@ManyToOne({ entity: () => Ingredient, primary: true })
	ingredient!: Rel<Ingredient>;

	@Property()
	note?: string; // optional field
}
