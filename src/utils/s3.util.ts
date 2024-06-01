import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import envConfig from '~configs/env.config';
import s3Config from '~configs/s3.config';
import { UploadImages } from '~types/s3.type';

class UploadUtil {
	s3!: S3Client;

	constructor() {
		if (!this.s3) {
			this.s3 = new S3Client(s3Config.S3_CLIENT_CONFIG);
		}
	}

	async uploadImage(file: UploadImages) {
		return await this.s3.send(
			new PutObjectCommand({
				Bucket: envConfig.S3_BUCKET,
				Key: file.name.split('.')[0] + '.webp',
				Body: file.data
			})
		);
	}
}

export default new UploadUtil();
