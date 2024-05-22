import { EntityManager, MikroORM } from '@mikro-orm/mariadb';
import MikroORM_CONFIG from '../configs/mikro.config';

class Mikro {
	private static instance: Mikro;
	private orm!: MikroORM;
	public em!: EntityManager;

	private constructor() {
		this.init();
	}

	public static getInstance(): Mikro {
		if (!Mikro.instance) {
			Mikro.instance = new Mikro();
		}
		return Mikro.instance;
	}

	private async init() {
		if (!this.orm) {
			this.orm = await MikroORM.init(MikroORM_CONFIG);
			this.em = this.orm.em.fork();
		}
	}
}

export default Mikro.getInstance();
