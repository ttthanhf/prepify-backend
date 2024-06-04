import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Recipe } from './recipe.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'category' })
export class Category {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	name!: string;

	@OneToMany(() => Recipe, (recipe) => recipe.category)
	recipes!: Recipe[];
}
