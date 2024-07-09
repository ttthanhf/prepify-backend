import * as amqp from 'amqplib';
import envConfig from '~configs/env.config';
import {
	ExchangeKeys,
	QueueKeys,
	RABBITMQ_BINDINGS,
	RABBITMQ_CONSTANT
} from '~constants/rabbitmq.constant';

interface Exchange {
	type: string;
	options?: amqp.Options.AssertExchange;
}

interface QueueBinding {
	[exchange: string]: string; // exchange name to routing key
}

class RabbitMQUtil {
	static instance: RabbitMQUtil;
	private rabbitmq!: amqp.Connection;
	private channel!: amqp.Channel;
	private exchanges: Map<string, Exchange>;
	private queues: Map<string, QueueBinding>;
	private queueOptions: Map<string, amqp.Options.AssertQueue>;

	private constructor() {
		this.exchanges = new Map<string, Exchange>();
		this.queues = new Map<string, QueueBinding>();
		this.queueOptions = new Map<string, amqp.Options.AssertQueue>();
		// this.initRabbitMQ();
	}

	public async connect(
		host: string,
		port: number,
		user: string,
		password: string
	): Promise<void> {
		if (this.isConnected()) {
			return;
		}
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
		if (this.isConnected() || this.rabbitmq) {
			return;
		}

		await this.connect(
			envConfig.RABBITMQ_HOST,
			envConfig.RABBITMQ_PORT,
			envConfig.RABBITMQ_USER,
			envConfig.RABBITMQ_PASSWORD
		);

		const delayedExchange = [
			RABBITMQ_CONSTANT.EXCHANGE.ORDER_BATCH,
			RABBITMQ_CONSTANT.EXCHANGE.ORDER_CANCEL,
			RABBITMQ_CONSTANT.EXCHANGE.ORDER_PROCESS
		];

		for (const exchangeKey in RABBITMQ_CONSTANT.EXCHANGE) {
			const exchangeName =
				RABBITMQ_CONSTANT.EXCHANGE[exchangeKey as ExchangeKeys];
			if (delayedExchange.includes(exchangeName)) {
				this.addExchange(exchangeName, 'x-delayed-message', {
					arguments: { 'x-delayed-type': 'direct' }
				});
			} else {
				this.addExchange(exchangeName, 'direct', { durable: true });
			}
		}

		// Create queues
		for (const queueKey in RABBITMQ_CONSTANT.QUEUE) {
			const queueName = RABBITMQ_CONSTANT.QUEUE[queueKey as QueueKeys];
			if (queueName == RABBITMQ_CONSTANT.QUEUE.ORDER_BATCH) {
				this.addQueue(queueName, {
					durable: true,
					arguments: { 'x-max-priority': 10 }
				});
			} else {
				this.addQueue(queueName);
			}
		}

		for (const binding of RABBITMQ_BINDINGS) {
			const queueName = binding.queue;
			const exchangeName = binding.exchange;
			const routingKey = binding.routingKey;
			this.bindQueue(queueName, exchangeName, routingKey);
		}

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

	public addQueue(name: string, options?: amqp.Options.AssertQueue): void {
		if (!this.queues.has(name)) {
			this.queues.set(name, {});
			this.queueOptions.set(name, options || {});
		}
	}

	public async assertQueues(): Promise<void> {
		for (const [name] of this.queues.entries()) {
			try {
				const options = this.queueOptions.get(name) || {};
				await this.channel.assertQueue(name, options);
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

	public async publishMessageToDelayQueue(
		exchange: string,
		routingKey: string,
		message: string,
		delay: number,
		priority?: number
	): Promise<void> {
		try {
			this.channel.publish(exchange, routingKey, Buffer.from(message), {
				headers: {
					'x-delay': delay
				},
				priority: priority ?? 0
			});
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

	public isConnected(): boolean {
		return this.rabbitmq !== undefined;
	}

	// public static getInstance(): RabbitMQUtil {
	// 	if (!RabbitMQUtil.instance) {
	// 		RabbitMQUtil.instance = new RabbitMQUtil();
	// 	}
	// 	return RabbitMQUtil.instance;
	// }

	public static async getInstance(): Promise<RabbitMQUtil> {
		if (!RabbitMQUtil.instance) {
			RabbitMQUtil.instance = new RabbitMQUtil();
			await RabbitMQUtil.instance.initRabbitMQ();
		} else if (!RabbitMQUtil.instance.isConnected()) {
			await RabbitMQUtil.instance.initRabbitMQ();
		}
		return RabbitMQUtil.instance;
	}
}

export default RabbitMQUtil;
