import { MikroORM } from '@mikro-orm/mariadb';
import MikroORM_CONFIG from '../configs/mikro.config';

let orm: MikroORM;

const initORM = async () => {
	if (!orm) {
		orm = await MikroORM.init(MikroORM_CONFIG);
	}
	return orm;
};

const getORM = () => {
	if (!orm) {
		throw new Error('ORM is not initialized. Call initORM first.');
	}
	return orm;
};

export default {
	initORM,
	getORM
};
