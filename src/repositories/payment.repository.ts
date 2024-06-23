import { Payment } from '~models/entities/payment.entity';
import { BaseRepository } from './base.repository';

class PaymentRepository extends BaseRepository<Payment> {
	constructor() {
		super(Payment);
	}
}

export default new PaymentRepository();
