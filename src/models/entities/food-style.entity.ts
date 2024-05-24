import {
	Collection,
	Entity,
	ManyToMany,
	PrimaryKey,
	Property
} from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'food_style' })
export class FoodStyle {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@Property()
	name!: string;

	@Property()
	type!: string;

	@ManyToMany({ mappedBy: 'foodStyles', entity: () => Recipe })
	recipes = new Collection<Recipe>(this);
}
