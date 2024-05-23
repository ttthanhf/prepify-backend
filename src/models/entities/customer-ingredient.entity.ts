import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Customer } from './customer.entity';
import { Ingredient } from './ingredient.entity';

@Entity({ tableName: 'customer_ingredient' })
export class CustomerIngredient {
	@PrimaryKey()
	@Property({ autoincrement: true, primary: true })
	id!: number;

	@ManyToOne()
	customer!: Customer;

	@ManyToOne()
	ingredient!: Ingredient;

	@Property()
	note?: string; // optional field
}
