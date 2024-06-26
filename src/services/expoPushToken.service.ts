import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { ExpoPushToken } from '~entities/expo-push-token.entity';
import ResponseModel from '~models/responses/response.model';
import { ExpoPushTokenSaveRequest } from '~models/schemas/expoPushToken.schemas.model';
import expoPushTokenRepository from '~repositories/expoPushToken.repository';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import headerUtil from '~utils/header.util';
import jwtUtil from '~utils/jwt.util';

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
					response.data = {
						message: 'Push token already saved'
					};
					return response.send();
				}
				await expoPushTokenRepository.update(expoPushToken);
			} else {
				await expoPushTokenRepository.create(expoPushToken);
			}

			response.data = {
				message: 'Push token saved successfully'
			};
			return response.send();
		} catch (error) {
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			response.message = 'Failed to save push token';
			return response.send();
		}
	}
}

export default new ExpoPushTokenService();
