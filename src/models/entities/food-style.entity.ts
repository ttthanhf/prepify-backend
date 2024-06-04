import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Recipe } from './recipe.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'food_style' })
export class FoodStyle {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	name!: string;

	@Column()
	type!: string;

	@ManyToMany(() => Recipe, (recipe) => recipe.foodStyles)
	recipes!: Recipe[];
}
