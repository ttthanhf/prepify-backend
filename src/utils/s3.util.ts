import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import envConfig from '~configs/env.config';
import s3Config from '~configs/s3.config';
import { Image } from '~models/entities/image.entity';
import imageRepository from '~repositories/image.repository';
import { UploadImages } from '~types/s3.type';

class UploadUtil {
	s3!: S3Client;

	constructor() {
		if (!this.s3) {
			this.s3 = new S3Client(s3Config.S3_CLIENT_CONFIG);
		}
	}

	async uploadImage(file: UploadImages) {
		const filename =
			file.type +
			'-' +
			file.name +
			'-T-' +
			String(Date.now()) +
			'-' +
			String(Math.floor(Math.random() * 900) + 100) +
			'.png';

		await this.s3.send(
			new PutObjectCommand({
				Bucket: envConfig.S3_BUCKET,
				Key: filename,
				Body: file.data
			})
		);

		const image = new Image();
		image.entityId = file.name;
		image.type = file.type;
		image.url = envConfig.S3_HOST + filename;
		await imageRepository.create(image);
	}
}

export default new UploadUtil();
