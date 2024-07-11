import { ConsumeMessage } from 'amqplib';
import { RABBITMQ_CONSTANT } from '~constants/rabbitmq.constant';
import expoUtil, { Notification } from '~utils/expo.util';
import RabbitMQUtil from '~utils/rabbitmq.util';

class NotificationWorker {
	static instance: NotificationWorker;
	private rabbitmqInstance: RabbitMQUtil;

	static getInstance(rabbitmqInstance: RabbitMQUtil): NotificationWorker {
		if (!NotificationWorker.instance) {
			NotificationWorker.instance = new NotificationWorker(rabbitmqInstance);
		}

		return NotificationWorker.instance;
	}

	private constructor(rabbitmqInstance: RabbitMQUtil) {
		this.rabbitmqInstance = rabbitmqInstance;
		this.startSubscribing();
	}

	private async startSubscribing() {
		await this.rabbitmqInstance.subscribe(
			RABBITMQ_CONSTANT.QUEUE.NOTIFICATION,
			(notification) => this.handleSendNotification(notification)
		);
	}

	async handleSendNotification(notificationMsg: ConsumeMessage | null) {
		const notification: Notification = JSON.parse(
			notificationMsg?.content.toString() || '{}'
		);
		await expoUtil.sendPushNotification(notification);
	}
}

export default NotificationWorker;
