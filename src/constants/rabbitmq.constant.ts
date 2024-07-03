export const RABBITMQ_CONSTANT = {
	EXCHANGE: {
		ORDER: 'order_exchange',
		NOTIFICATION: 'notification_exchange'
	},
	QUEUE: {
		ORDER: 'order_processing_queue',
		NOTIFICATION: 'notification_queue'
	},
	ROUTING_KEY: {
		ORDER: 'order.process',
		NOTIFICATION: 'notification.send'
	}
};
