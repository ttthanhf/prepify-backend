import {
	FindManyOptions,
	FindOneOptions,
	FindOptionsWhere,
	ObjectLiteral,
	ObjectType,
	RemoveOptions,
	Repository
} from 'typeorm';
import typeormUtil from '~utils/typeorm.util';

export class BaseRepository<T extends ObjectLiteral> {
	protected db: Repository<T>;

	constructor(entity: ObjectType<T>) {
		this.db = typeormUtil.AppDataSource.getRepository(entity);
	}

	async create(item: T): Promise<T> {
		return await this.db.save(item);
	}

	async update(item: T): Promise<T> {
		return await this.db.save(item);
	}

	async findOne(opts: FindOneOptions<T>): Promise<T | null> {
		return await this.db.findOne(opts);
	}

	async findAll(): Promise<T[]> {
		return await this.db.find();
	}

	async find(opts: FindManyOptions<T>): Promise<T[]> {
		return await this.db.find(opts);
	}

	async findBy(
		opts: FindOptionsWhere<T> | FindOptionsWhere<T>[]
	): Promise<T[]> {
		return await this.db.findBy(opts);
	}

	async findOneBy(
		opts: FindOptionsWhere<T> | FindOptionsWhere<T>[]
	): Promise<T | null> {
		return await this.db.findOneBy(opts);
	}

	async remove(entities: T, options?: RemoveOptions | undefined): Promise<T> {
		return await this.db.remove(entities, options);
	}

	async count(opts?: FindManyOptions<T>) {
		return await this.db.count(opts);
	}

	getRepository() {
		return this.db;
	}
}
