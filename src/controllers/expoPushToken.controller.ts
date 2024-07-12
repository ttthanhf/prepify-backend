import expoPushTokenService from '~services/expoPushToken.service';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';

class ExpoPushTokenController {
	async savePushToken(req: FastifyRequest, res: FastifyResponse) {
		return expoPushTokenService.saveExpoPushTokenHandle(req, res);
	}

	async getPushTokenByDeviceId(req: FastifyRequest, res: FastifyResponse) {
		return expoPushTokenService.getExpoPushTokenByDeviceIdHandle(req, res);
	}

	async sendPushNotification(req: FastifyRequest, res: FastifyResponse) {
		return expoPushTokenService.sendExpoPushNotificationToShipper(req, res);
	}
}

export default new ExpoPushTokenController();
