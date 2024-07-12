import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { ExpoPushToken } from '~entities/expo-push-token.entity';
import ResponseModel from '~models/responses/response.model';
import { ExpoPushTokenSaveRequest } from '~models/schemas/expoPushToken.schemas.model';
import expoPushTokenRepository from '~repositories/expoPushToken.repository';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import expoUtil, { Notification } from '~utils/expo.util';
import headerUtil from '~utils/header.util';
import jwtUtil from '~utils/jwt.util';
import userUtil from '~utils/user.util';

class ExpoPushTokenService {
	async saveExpoPushTokenHandle(req: FastifyRequest, res: FastifyResponse) {
		const token = headerUtil.extractAuthorization(req.headers);
		const userId = jwtUtil.verify(token).userId;

		const { deviceId, pushToken, deviceInfo } =
			req.body as ExpoPushTokenSaveRequest;
		const response = new ResponseModel(res);

		try {
			const expoPushToken = new ExpoPushToken();
			expoPushToken.user = { id: userId } as any;
			expoPushToken.deviceId = deviceId;
			expoPushToken.pushToken = pushToken;
			expoPushToken.deviceInfo = deviceInfo;

			const existingToken = await expoPushTokenRepository.findOne({
				where: {
					deviceId
				}
			});

			if (existingToken) {
				if (existingToken.pushToken === pushToken) {
					response.message = 'Push token already saved';
					return response.send();
				}
				await expoPushTokenRepository.update(expoPushToken);
			} else {
				await expoPushTokenRepository.create(expoPushToken);
			}

			response.message = 'Push token saved successfully';
			return response.send();
		} catch (error) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Failed to save push token';
			return response.send();
		}
	}

	async getExpoPushTokenByDeviceIdHandle(
		req: FastifyRequest,
		res: FastifyResponse
	) {
		const { device_id }: any = req.params as Object;

		const response = new ResponseModel(res);
		try {
			const existingToken = await expoPushTokenRepository.findOne({
				where: {
					deviceId: device_id
				}
			});

			if (!existingToken) {
				response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
				response.message = 'Push token is not found';
				return response.send();
			}

			response.data = {
				token: existingToken
			};

			return response.send();
		} catch (error) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Failed to get push token';
			return response.send();
		}
	}

	async getExpoPushTokensByShipper(
		shipperId: string
	): Promise<ExpoPushToken[]> {
		try {
			const tokens = await expoPushTokenRepository.find({
				where: {
					user: {
						id: shipperId
					}
				},
				relations: ['user']
			});

			return tokens;
		} catch (error) {
			return [];
		}
	}

	async sendExpoPushNotificationToShipper(
		req: FastifyRequest,
		res: FastifyResponse
	) {
		const shipper = await userUtil.getUserByTokenInHeader(req.headers);

		const response = new ResponseModel(res);
		if (!shipper) {
			response.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
			response.message = 'Shipper not found';
			return response.send();
		}

		const pushTokens = await this.getExpoPushTokensByShipper(shipper!.id);

		pushTokens.map((pushToken) => {
			const notification: Notification = {
				pushToken: pushToken.pushToken,
				title: 'Đã có đơn hàng mới',
				body: 'Nhận ngay ->'
			};
			expoUtil.sendPushNotification(notification);
		});

		return response.send();
	}
}

export default new ExpoPushTokenService();
