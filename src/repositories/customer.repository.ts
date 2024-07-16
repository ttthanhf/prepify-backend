import { BaseRepository } from './base.repository';
import { Customer } from '~models/entities/customer.entity';

class CustomerRepository extends BaseRepository<Customer> {
	constructor() {
		super(Customer);
	}
}

export default new CustomerRepository();
