import { FastifyRequest } from 'fastify';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { ImageType } from '~constants/image.constant';
import { Role } from '~constants/role.constant';
import { Image } from '~models/entities/image.entity';
import ResponseModel from '~models/responses/response.model';
import { UploadDeleteRequestSchema } from '~models/schemas/moderator/upload.schemas.model';
import extraSpiceRepository from '~repositories/extraSpice.repository';
import imageRepository from '~repositories/image.repository';
import ingredientRepository from '~repositories/ingredient.repository';
import recipeRepository from '~repositories/recipe.repository';
import userRepository from '~repositories/user.repository';
import { FastifyResponse } from '~types/fastify.type';
import objectUtil from '~utils/object.util';
import s3Util from '~utils/s3.util';
import stringUtil from '~utils/string.util';
import userUtil from '~utils/user.util';

class UploadModeratorService {
	async uploadImage(req: FastifyRequest, res: FastifyResponse) {
		const user = await userUtil.getUserByTokenInHeader(req.headers);
		const imageObj = {} as Image;
		const files: Array<any> = [];

		const response = new ResponseModel(res);

		for await (const part of req.parts()) {
			if (part.type == 'field') {
				objectUtil.setProperty(
					imageObj,
					part.fieldname as keyof Image,
					stringUtil.tryParseStringToJSON(String(part.value))
				);
			} else if (part.type == 'file') {
				if (part.fieldname == 'images') {
					if (part.mimetype.startsWith('image/')) {
						files.push(await part.toBuffer());
					}
				} else {
					response.message = 'Images have some file not image';
					response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
					return response.send();
				}
			}
		}

		if (files.length == 0) {
			response.message = 'Input at least one image';
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			return response.send();
		}

		if (imageObj.type != ImageType.USER && user!.role == Role.CUSTOMER) {
			response.message = 'Not Permission';
			response.statusCode = HTTP_STATUS_CODE.FORBIDDEN;
			return response.send();
		}

		let item: any = null;
		let maxImage = 1;
		switch (imageObj.type) {
			case ImageType.EXTRASPICE:
				item = await extraSpiceRepository.findOne({
					where: {
						id: imageObj.entityId
					}
				});
				break;
			case ImageType.RECIPE:
				item = await recipeRepository.findOne({
					where: {
						id: imageObj.entityId
					}
				});

				maxImage = -1;
				break;
			case ImageType.INGREDIENT:
				item = await ingredientRepository.findOne({
					where: {
						id: imageObj.entityId
					}
				});
				break;
			case ImageType.USER:
				if (imageObj.entityId != user!.id) {
					response.message = 'Not your id';
					response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
					return response.send();
				}
				item = await userRepository.findOne({
					where: {
						id: imageObj.entityId
					}
				});
				break;
			default:
				response.message = 'Type not support';
				response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
				return response.send();
		}

		if (!item) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}

		const image = await imageRepository.findOne({
			where: {
				entityId: imageObj.entityId,
				type: imageObj.type
			}
		});

		if (image && imageObj.type != ImageType.RECIPE) {
			response.message = 'Remove old image before upload new image';
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			return response.send();
		}

		for await (const file of files) {
			await s3Util.uploadImage({
				data: file,
				name: item.id,
				type: imageObj.type
			});
			if (maxImage == 1) {
				break;
			}
		}

		return response.send();
	}

	async deleteImage(req: FastifyRequest, res: FastifyResponse) {
		const query: UploadDeleteRequestSchema =
			req.body as UploadDeleteRequestSchema;
		const response = new ResponseModel(res);

		query.forEach(async (item) => {
			const image = await imageRepository.findOneBy({
				entityId: item.entityId,
				type: item.type
			});
			if (image) {
				await imageRepository.removeOne(image);
			}
		});

		return response.send();
	}
}
export default new UploadModeratorService();
