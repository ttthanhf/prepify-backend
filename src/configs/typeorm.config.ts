import { DataSourceOptions } from 'typeorm';
import envConfig from './env.config';
import { Recipe } from '../models/entities/recipe.entity';
import { Category } from '~models/entities/category.entity';
import { User } from '~models/entities/user.entity';
import { Area } from '~models/entities/area.entity';
import { Customer } from '~models/entities/customer.entity';
import { RestrictIngredient } from '~models/entities/restrict-ingredient.entity';
import { Order } from '~models/entities/order.entity';
import { FoodStyle } from '~models/entities/food-style.entity';
import { Ingredient } from '~models/entities/ingredient.entity';
import { RecipeIngredient } from '~models/entities/recipe-ingredient.entity';
import { OrderDetail } from '~models/entities/order-detail.entity';
import { MealKit } from '~models/entities/meal-kit.entity';
import { Batch } from '~models/entities/batch.entity';
import { OrderBatch } from '~models/entities/order-batch.entity';
import { Payment } from '~models/entities/payment.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { OrderPayment } from '~models/entities/order-payment.entity';
import { RecipeNutrition } from '~models/entities/recipe-nutrition.entity';
import { Nutrition } from '~models/entities/nutrition.entity';
import { Unit } from '~models/entities/unit.entity';
import { ENVIROMENT } from '~constants/env.constant';
import { ExtraSpice } from '~models/entities/extra-spice.entity';
import { Config } from '~models/entities/config.entity';
import { ExpoPushToken } from '~models/entities/expo-push-token.entity';
import { Image } from '~models/entities/image.entity';
import { Feedback } from '~models/entities/feedback.entity';

const TYPEORM_CONFIG: DataSourceOptions = {
	type: 'mariadb',
	host: envConfig.MARIADB_HOST,
	port: envConfig.MARIADB_PORT,
	username: envConfig.MARIADB_USER,
	password: envConfig.MARIADB_PASSWORD,
	database: envConfig.MARIADB_DATABASE,
	entities: [
		User,
		Area,
		Batch,
		Customer,
		Order,
		OrderBatch,
		Category,
		FoodStyle,
		Ingredient,
		Recipe,
		RecipeIngredient,
		OrderDetail,
		Payment,
		MealKit,
		OrderPayment,
		RecipeNutrition,
		Nutrition,
		Unit,
		ExtraSpice,
		Config,
		ExpoPushToken,
		Image,
		RestrictIngredient,
		Feedback
	],
	synchronize: false, //warning its will - with db - if y delete entity - db will delete it
	logging: envConfig.ENVIROMENT == ENVIROMENT.DEVELOPMENT,
	namingStrategy: new SnakeNamingStrategy()
};

export default {
	TYPEORM_CONFIG
};
