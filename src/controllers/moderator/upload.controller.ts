import { FastifyRequest } from 'fastify';
import { FastifyResponse } from '~types/fastify.type';
import uploadService from '~services/moderator/upload.service';

class UploadModeratorController {
	async uploadImage(req: FastifyRequest, res: FastifyResponse) {
		return uploadService.uploadImage(req, res);
	}

	async deleteImage(req: FastifyRequest, res: FastifyResponse) {
		return uploadService.deleteImage(req, res);
	}
}

export default new UploadModeratorController();
