import {
	S3Client,
	PutObjectCommand,
	ListObjectsV2Command
} from '@aws-sdk/client-s3';
import envConfig from '~configs/env.config';
import s3Config from '~configs/s3.config';
import { GetImages, UploadImages } from '~types/s3.type';

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
				Key:
					file.type +
					'-' +
					file.name +
					'-T-' +
					String(Date.now()) +
					'-' +
					String(Math.floor(Math.random() * 900) + 100) +
					'.webp',
				Body: file.data
			})
		);
	}

	async getImages(file: GetImages) {
		return await this.s3.send(
			new ListObjectsV2Command({
				Bucket: envConfig.S3_BUCKET,
				Prefix: file.name ? file.type + '-' + file.name : file.type + '-',
				MaxKeys: 1000000000
			})
		);
	}
}

export default new UploadUtil();
