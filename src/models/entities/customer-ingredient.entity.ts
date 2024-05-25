import { Entity, ManyToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core';
import { Customer } from './customer.entity';
import { Ingredient } from './ingredient.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'customer_ingredient' })
export class CustomerIngredient {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@ManyToOne({ entity: () => Customer })
	customer!: Rel<Customer>;

	@ManyToOne({ entity: () => Ingredient })
	ingredient!: Rel<Ingredient>;

	@Property()
	note?: string; // optional field
}
