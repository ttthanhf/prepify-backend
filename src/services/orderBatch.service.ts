import orderBatchRepository from '~repositories/orderBatch.repository';

class OrderBatchService {
	async getLatestOrderBatchByOrderIdHandle(orderId: string) {
		const latestOrderBatchQuery = orderBatchRepository
			.getRepository()
			.createQueryBuilder('orderBatch');
		// .leftJoinAndSelect('orderBatch.order', 'order')
		// .leftJoinAndSelect('orderBatch.batch', 'batch')
		// .leftJoinAndSelect('batch.user', 'user')
		// // .where('orderBatch.orderId = :orderId', { orderId })
		// .orderBy('orderBatch.datetime', 'DESC')
		// .take(1);

		// console.log(latestOrderBatchQuery.getQueryAndParameters());

		let orderBatch = await latestOrderBatchQuery.getOne();
		console.log(orderBatch);
		return orderBatch;
	}
}

export default new OrderBatchService();
