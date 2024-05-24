import {
	Collection,
	Entity,
	OneToMany,
	PrimaryKey,
	Property
} from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'category' })
export class Category {
	@PrimaryKey({ type: 'uuid' })
	id: string = uuidv4();

	@Property()
	name!: string;

	@OneToMany('Recipe', 'category')
	recipes = new Collection<Recipe>(this);
}
