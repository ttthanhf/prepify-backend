import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Recipe } from './recipe.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'food_style' })
export class FoodStyle {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	name!: string;

	@Column()
	slug!: string;

	@Column()
	title!: string;

	@Column()
	type!: string;

	@ManyToMany(() => Recipe, (recipe) => recipe.foodStyles)
	@JoinTable({
		name: 'recipe_style'
	})
	recipes!: Recipe[];
}
