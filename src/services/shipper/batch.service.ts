import { BatchStatus } from '~constants/batchstatus.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { OrderStatus } from '~constants/orderstatus.constant';
import ResponseModel from '~models/responses/response.model';
import batchRepository from '~repositories/batch.repository';
import orderRepository from '~repositories/order.repository';
import orderBatchRepository from '~repositories/orderBatch.repository';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import userUtil from '~utils/user.util';

class BatchService {
	async pickUpBatchHandle(req: FastifyRequest, res: FastifyResponse) {
		const { id } = req.params as { id: string };
		const shipper = await userUtil.getUserByTokenInHeader(req.headers);
		const response = new ResponseModel(res);

		// check if shipper picking up another batch
		const currentBatch = await batchRepository.findOne({
			where: {
				user: {
					id
				},
				status: BatchStatus.PICKED_UP
			}
		});

		if (currentBatch) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Shipper is picking up another batch';
			return response.send();
		}

		const batch = await batchRepository.findOne({
			where: { id, status: BatchStatus.CREATED },
			relations: ['orderBatches', 'orderBatches.order']
		});

		if (!batch) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			response.message = 'Batch not found';
			return response.send();
		}

		await Promise.all([
			batchRepository
				.getRepository()
				.createQueryBuilder('batch')
				.update()
				.set({ status: BatchStatus.PICKED_UP, user: shipper! })
				.where('id = :id', { id })
				.execute(),
			...batch.orderBatches.map(async (orderBatchData) => {
				await orderBatchRepository
					.getRepository()
					.createQueryBuilder('orderBatch')
					.update()
					.set({ status: OrderStatus.PICKED_UP })
					.where('order_id = :orderId', { orderId: orderBatchData.order.id })
					.andWhere('batch_id = :batchId', { batchId: batch.id })
					.execute();
				await orderRepository
					.getRepository()
					.createQueryBuilder('order')
					.update()
					.set({ status: OrderStatus.PICKED_UP })
					.where('id = :orderId', { orderId: orderBatchData.order.id })
					.execute();
			})
		]);

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

		// check if shipper has picked up a batch
		const currentBatch = await batchRepository.findOne({
			where: {
				user: {
					id: shipper!.id
				},
				status: BatchStatus.PICKED_UP
			}
		});

		response.data = {
			batch: {
				...batch,
				isPickupable: !currentBatch
			}
		};
		return response.send();
	}
}

export default new BatchService();
