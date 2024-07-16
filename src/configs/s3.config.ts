import { S3ClientConfig } from '@aws-sdk/client-s3';
import envConfig from './env.config';

const S3_CLIENT_CONFIG: S3ClientConfig = {
	endpoint: envConfig.S3_END_POINT,
	region: envConfig.S3_REGION,
	credentials: {
		accessKeyId: envConfig.S3_ID,
		secretAccessKey: envConfig.S3_KEY
	}
};

export default {
	S3_CLIENT_CONFIG
};
