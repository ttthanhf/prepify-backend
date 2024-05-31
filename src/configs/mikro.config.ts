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
import { OrderPayment } from '~models/entities/order-payment.entity';
import { Nutrition } from '~models/entities/nutrition.entity';
import { RecipeNutrition } from '~models/entities/recipe-nutrition.entity';
import { Unit } from '~models/entities/unit.entity';

export default defineConfig({
	driver: MariaDbDriver,
	entities: [
		Area,
		Batch,
		Category,
		Customer,
		CustomerIngredient,
		FoodStyle,
		Ingredient,
		MealKit,
		Nutrition,
		Order,
		OrderBatch,
		OrderDetail,
		OrderPayment,
		Payment,
		Recipe,
		RecipeIngredient,
		RecipeNutrition,
		Unit,
		User
	],
	entitiesTs: [
		Area,
		Batch,
		Category,
		Customer,
		CustomerIngredient,
		FoodStyle,
		Ingredient,
		MealKit,
		Nutrition,
		Order,
		OrderBatch,
		OrderDetail,
		OrderPayment,
		Payment,
		Recipe,
		RecipeIngredient,
		RecipeNutrition,
		Unit,
		User
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
