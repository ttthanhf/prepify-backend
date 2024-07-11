import batchService from '~services/shipper/batch.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class BatchController {
	async pickUpBatch(req: FastifyRequest, res: FastifyResponse) {
		return batchService.pickUpBatchHandle(req, res);
	}

	async getBatchesByShipperArea(req: FastifyRequest, res: FastifyResponse) {
		return batchService.getBatchesByShipperHandle(req, res);
	}
}

export default new BatchController();
