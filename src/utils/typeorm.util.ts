import { DataSource } from 'typeorm';
import typeormConfig from '~configs/typeorm.config';

const AppDataSource = new DataSource(typeormConfig.TYPEORM_CONFIG);
AppDataSource.initialize();
console.log('TypeORM init successfully');

export default {
	AppDataSource
};
