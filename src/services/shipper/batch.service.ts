import { BatchStatus } from '~constants/batchstatus.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { OrderStatus } from '~constants/orderstatus.constant';
import ResponseModel from '~models/responses/response.model';
import batchRepository from '~repositories/batch.repository';
import orderBatchRepository from '~repositories/orderBatch.repository';
import userRepository from '~repositories/user.repository';
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
			batch.orderBatches.map(async (orderBatch) => {
				orderBatch.status = BatchStatus.PICKED_UP as unknown as OrderStatus;
				await orderBatchRepository.update(orderBatch);
			})
		);

		response.data = {
			batch
		};

		return response.send();
	}

	async getBatchesByShipperAreaHandle(
		req: FastifyRequest,
		res: FastifyResponse
	) {
		const response = new ResponseModel(res);
		const shipper = await userUtil.getUserByTokenInHeader(req.headers);
		const shipperArea = await userRepository.findOne({
			where: {
				id: shipper!.id
			},
			relations: ['area']
		});

		if (!shipperArea || !shipperArea.area) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Shipper area not found';
			return response.send();
		}

		const batches = await batchRepository.find({
			where: {
				status: BatchStatus.CREATED,
				area: {
					id: shipperArea!.area!.id
				}
			},
			relations: ['area', 'orderBatches', 'orderBatches.order']
		});

		response.data = {
			batches
		};
		return response.send();
	}
}

export default new BatchService();
