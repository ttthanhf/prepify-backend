import { RecipeIngredient } from './recipe-ingredient.entity';
import { v4 as uuidv4 } from 'uuid';
import {
	CustomerIngredient,
	RestrictIngredient
} from './restrict-ingredient.entity';
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	Relation
} from 'typeorm';
import { Unit } from './unit.entity';

@Entity({ name: 'ingredient' })
export class Ingredient {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@Column()
	name!: string;

	@Column()
	category!: string;

	@Column()
	price!: number;

	@Column()
	description?: string;

	@Column({
		type: 'datetime'
	})
	updatedAt!: Date;

	@OneToMany(
		() => RecipeIngredient,
		(recipeIngredient) => recipeIngredient.ingredient
	)
	recipeIngredients!: RecipeIngredient[];

	@OneToMany(
		() => RestrictIngredient,
		(restrictIngredient) => restrictIngredient.ingredient
	)
	restrictIngredients!: RestrictIngredient[];

	@ManyToOne(() => Unit, (unit) => unit.ingredients)
	unit!: Relation<Unit>;

	image?: string;
}
