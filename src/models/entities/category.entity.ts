import {
	Collection,
	Entity,
	OneToMany,
	PrimaryKey,
	Property
} from '@mikro-orm/core';
import { Recipe } from './recipe.entity';

@Entity({ tableName: 'category' })
export class Category {
	@PrimaryKey()
	@Property({ autoincrement: true, primary: true })
	id!: number;

	@Property()
	name!: string;

	@OneToMany({ mappedBy: 'category' })
	recipes = new Collection<Recipe>(this);
}
