import { Expo, ExpoPushMessage } from 'expo-server-sdk';

export interface Notification {
	pushToken: string;
	title: string;
	body: string;
	data?: Record<string, unknown>;
}

class ExpoUtil {
	private expo = new Expo();

	async sendPushNotification({ pushToken, title, body, data }: Notification) {
		if (!Expo.isExpoPushToken(pushToken)) {
			throw new Error(`Push token ${pushToken} is not a valid Expo push token`);
		}

		const messages: ExpoPushMessage[] = [
			{
				to: pushToken,
				sound: 'default',
				title,
				body,
				data
			}
		];

		const chunks = this.expo.chunkPushNotifications(messages);
		const tickets = [];

		for (const chunk of chunks) {
			try {
				const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
				tickets.push(...ticketChunk);
			} catch (error) {
				throw new Error(`Error sending push notification: ${error}`);
			}
		}

		return tickets;
	}
}

export default new ExpoUtil();
