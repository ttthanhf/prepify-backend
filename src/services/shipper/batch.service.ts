import { BatchStatus } from '~constants/batchstatus.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { OrderStatus } from '~constants/orderstatus.constant';
import ResponseModel from '~models/responses/response.model';
import batchRepository from '~repositories/batch.repository';
import orderBatchRepository from '~repositories/orderBatch.repository';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import userUtil from '~utils/user.util';

class BatchService {
	async pickUpBatchHandle(req: FastifyRequest, res: FastifyResponse) {
		const { id } = req.params as { id: string };
		const shipper = await userUtil.getUserByTokenInHeader(req.headers);
		const response = new ResponseModel(res);

		const batch = await batchRepository.findOne({
			where: { id },
			relations: ['orderBatches']
		});

		if (!batch) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			response.message = 'Batch not found';
			return response.send();
		}

		batch.status = BatchStatus.PICKED_UP;
		batch.user = shipper!;
		await batchRepository.update(batch);

		// update picked up status for all order in batch
		await Promise.all(
			batch.orderBatches.map(async (orderBatchData) => {
				const orderBatch = await orderBatchRepository
					.getRepository()
					.createQueryBuilder('orderBatch')
					.leftJoinAndSelect('orderBatch.order', 'order')
					.leftJoinAndSelect('orderBatch.batch', 'batch')
					.where('order.id = :orderId', { orderId: orderBatchData.order })
					.andWhere('batch.id = :batchId', { batchId: batch.id })
					.getOne();

				orderBatch!.status = BatchStatus.PICKED_UP as unknown as OrderStatus;
				await orderBatchRepository.update(orderBatch!);
			})
		);

		response.data = {
			batch
		};

		return response.send();
	}

	async getBatchesByShipperHandle(req: FastifyRequest, res: FastifyResponse) {
		const response = new ResponseModel(res);
		const shipper = await userUtil.getUserByTokenInHeader(req.headers);

		const batch = await batchRepository.findOne({
			where: {
				status: BatchStatus.CREATED,
				user: {
					id: shipper!.id
				}
			},
			relations: ['area', 'orderBatches', 'orderBatches.order']
		});

		response.data = {
			batch
		};
		return response.send();
	}
}

export default new BatchService();
