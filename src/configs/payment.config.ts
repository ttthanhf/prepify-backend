import envConfig from './env.config';

export const VNPAY_CONFIG = {
	vnp_Url: envConfig.VNPAY_URL,
	vnp_TmnCode: envConfig.VNPAY_ID,
	vnp_ReturnUrl: envConfig.VNPAY_REDIRECT,
	vnp_SecureHash: envConfig.VNPAY_KEY
};
