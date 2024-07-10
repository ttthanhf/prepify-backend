export const RABBITMQ_CONSTANT = {
	EXCHANGE: {
		ORDER_CREATE: 'order_create_exchange',
		ORDER_PROCESS: 'order_process_exchange',
		ORDER_CANCEL: 'order_cancel_exchange',
		ORDER_BATCH: 'order_batch_exchange',
		NOTIFICATION: 'notification_exchange'
	},
	QUEUE: {
		ORDER_CREATE: 'order_create_queue',
		ORDER_PROCESS: 'order_process_queue',
		ORDER_CANCEL: 'order_cancel_queue',
		ORDER_BATCH: 'order_batch_queue',
		NOTIFICATION: 'notification_queue'
	},
	ROUTING_KEY: {
		ORDER_CREATE: 'order.create',
		ORDER_PROCESS: 'order.process',
		ORDER_CANCEL: 'order.cancel',
		ORDER_BATCH: 'order.batch',
		NOTIFICATION: 'notification.send'
	},
	BINDINGS: []
};

export type ExchangeKeys = keyof typeof RABBITMQ_CONSTANT.EXCHANGE;
export type QueueKeys = keyof typeof RABBITMQ_CONSTANT.QUEUE;
export type RoutingKeyKeys = keyof typeof RABBITMQ_CONSTANT.ROUTING_KEY;

const generateBindings = () => {
	const bindings = [
		{
			queue: RABBITMQ_CONSTANT.QUEUE.ORDER_CREATE,
			exchange: RABBITMQ_CONSTANT.EXCHANGE.ORDER_CREATE,
			routingKey: RABBITMQ_CONSTANT.ROUTING_KEY.ORDER_CREATE
		},
		{
			queue: RABBITMQ_CONSTANT.QUEUE.ORDER_PROCESS,
			exchange: RABBITMQ_CONSTANT.EXCHANGE.ORDER_PROCESS,
			routingKey: RABBITMQ_CONSTANT.ROUTING_KEY.ORDER_PROCESS
		},
		{
			queue: RABBITMQ_CONSTANT.QUEUE.ORDER_CANCEL,
			exchange: RABBITMQ_CONSTANT.EXCHANGE.ORDER_CANCEL,
			routingKey: RABBITMQ_CONSTANT.ROUTING_KEY.ORDER_CANCEL
		},
		{
			queue: RABBITMQ_CONSTANT.QUEUE.NOTIFICATION,
			exchange: RABBITMQ_CONSTANT.EXCHANGE.NOTIFICATION,
			routingKey: RABBITMQ_CONSTANT.ROUTING_KEY.NOTIFICATION
		},
		{
			queue: RABBITMQ_CONSTANT.QUEUE.ORDER_BATCH,
			exchange: RABBITMQ_CONSTANT.EXCHANGE.ORDER_BATCH,
			routingKey: RABBITMQ_CONSTANT.ROUTING_KEY.ORDER_BATCH
		}
	];

	return bindings;
};

export const RABBITMQ_BINDINGS = generateBindings();
