import { MariaDbDriver, defineConfig } from '@mikro-orm/mariadb';
import { User } from '~entities/user.entity';
import envConfig from './env.config';
import { Area } from '~entities/area.entity';
import { OrderBatch } from '~entities/order-batch.entity';
import { Order } from '~entities/order.entity';
import { CustomerIngredient } from '~entities/customer-ingredient.entity';
import { Customer } from '~entities/customer.entity';
import { Batch } from '~entities/batch.entity';
import { Category } from '~entities/category.entity';
import { FoodStyle } from '~entities/food-style.entity';
import { Ingredient } from '~entities/ingredient.entity';
import { Recipe } from '~entities/recipe.entity';
import { RecipeIngredient } from '~entities/recipe-ingredient.entity';
import { OrderDetail } from '~entities/order-detail.entity';
import { Payment } from '~entities/payment.entity';
import { MealKit } from '~entities/meal-kit.entity';

export default defineConfig({
	driver: MariaDbDriver,
	entities: [
		User,
		Area,
		Batch,
		Customer,
		CustomerIngredient,
		Order,
		OrderBatch,
		Category,
		FoodStyle,
		Ingredient,
		Recipe,
		RecipeIngredient,
		OrderDetail,
		Payment,
		MealKit
	],
	entitiesTs: [
		User,
		Area,
		Batch,
		Customer,
		CustomerIngredient,
		Order,
		OrderBatch,
		Category,
		FoodStyle,
		Ingredient,
		Recipe,
		RecipeIngredient,
		OrderDetail,
		Payment,
		MealKit
	],
	host: envConfig.MARIADB_HOST,
	user: envConfig.MARIADB_USER,
	password: envConfig.MARIADB_PASSWORD,
	dbName: envConfig.MARIADB_DATABASE,
	port: envConfig.MARIADB_PORT,
	clientUrl: envConfig.MARIADB_CLIENTURL,
	validate: true,
	strict: true,
	validateRequired: false,
	pool: {
		min: 5,
		max: 20
	},
	debug: true
});
