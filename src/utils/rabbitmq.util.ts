import * as amqp from 'amqplib';
import envConfig from '~configs/env.config';
import { RABBITMQ_CONSTANT } from '~constants/rabbitmq.constant';

interface Exchange {
	type: string;
	options?: amqp.Options.AssertExchange;
}

interface QueueBinding {
	[exchange: string]: string; // exchange name to routing key
}

class RabbitMQUtil {
	private rabbitmq!: amqp.Connection;
	private channel!: amqp.Channel;
	private exchanges: Map<string, Exchange>;
	private queues: Map<string, QueueBinding>;

	constructor() {
		this.exchanges = new Map<string, Exchange>();
		this.queues = new Map<string, QueueBinding>();
		this.initRabbitMQ();
	}

	public async connect(
		host: string,
		port: number,
		user: string,
		password: string
	): Promise<void> {
		try {
			const url = `amqp://${user}:${password}@${host}:${port}`;
			this.rabbitmq = await amqp.connect(url);
			this.channel = await this.rabbitmq.createChannel();
			console.log('Connected to RabbitMQ');
		} catch (error) {
			console.error(`Connection error: ${error}`);
		}
	}

	public async initRabbitMQ() {
		await this.connect(
			envConfig.RABBITMQ_HOST,
			envConfig.RABBITMQ_PORT,
			envConfig.RABBITMQ_USER,
			envConfig.RABBITMQ_PASSWORD
		);

		// Add exchanges
		this.addExchange(RABBITMQ_CONSTANT.EXCHANGE.ORDER, 'direct');
		this.addExchange(RABBITMQ_CONSTANT.EXCHANGE.NOTIFICATION, 'direct');

		// Add queues
		this.addQueue(RABBITMQ_CONSTANT.QUEUE.ORDER);
		this.addQueue(RABBITMQ_CONSTANT.QUEUE.NOTIFICATION);

		// Bind queues
		this.bindQueue(
			RABBITMQ_CONSTANT.QUEUE.ORDER,
			RABBITMQ_CONSTANT.EXCHANGE.ORDER,
			RABBITMQ_CONSTANT.ROUTING_KEY.ORDER
		);
		this.bindQueue(
			RABBITMQ_CONSTANT.QUEUE.NOTIFICATION,
			RABBITMQ_CONSTANT.EXCHANGE.NOTIFICATION,
			RABBITMQ_CONSTANT.ROUTING_KEY.NOTIFICATION
		);

		// Assert exchanges and queues
		await this.assertExchanges();
		await this.assertQueues();
		await this.bindQueues();
	}

	public addExchange(
		name: string,
		type: string,
		options?: amqp.Options.AssertExchange
	): void {
		this.exchanges.set(name, { type, options });
	}

	public async assertExchanges(): Promise<void> {
		for (const [name, exchange] of this.exchanges.entries()) {
			try {
				await this.channel.assertExchange(
					name,
					exchange.type,
					exchange.options
				);
			} catch (error) {
				console.error(`Error asserting exchange ${name}: ${error}`);
			}
		}
	}

	public addQueue(name: string): void {
		if (!this.queues.has(name)) {
			this.queues.set(name, {});
		}
	}

	public async assertQueues(): Promise<void> {
		for (const [name] of this.queues.entries()) {
			try {
				await this.channel.assertQueue(name);
			} catch (error) {
				console.error(`Error asserting queue ${name}: ${error}`);
			}
		}
	}

	public bindQueue(
		queueName: string,
		exchangeName: string,
		routingKey: string
	): void {
		const queueBindings = this.queues.get(queueName);
		if (queueBindings) {
			queueBindings[exchangeName] = routingKey;
		} else {
			console.error(`Queue ${queueName} does not exist. Cannot bind.`);
		}
	}

	public async bindQueues(): Promise<void> {
		for (const [queueName, bindings] of this.queues.entries()) {
			for (const [exchangeName, routingKey] of Object.entries(bindings)) {
				try {
					await this.channel.bindQueue(queueName, exchangeName, routingKey);
				} catch (error) {
					console.error(
						`Error binding queue ${queueName} to exchange ${exchangeName}:${error}`
					);
				}
			}
		}
	}

	public async publishMessage(
		exchange: string,
		routingKey: string,
		message: string
	): Promise<void> {
		try {
			this.channel.publish(exchange, routingKey, Buffer.from(message));
		} catch (error: any) {
			console.error('Send message error:', error);
		}
	}

	public async subscribe(
		queue: string,
		onMessage: (msg: amqp.ConsumeMessage | null) => void
	): Promise<void> {
		try {
			await this.channel.consume(queue, onMessage, { noAck: true });
		} catch (error) {
			console.error(`Error subscribing to queue ${queue}: ${error}`);
		}
	}

	public async close(): Promise<void> {
		try {
			await this.channel.close();
			await this.rabbitmq.close();
		} catch (error) {
			console.error(`Closing error: ${error}`);
		}
	}
}

export default new RabbitMQUtil();
