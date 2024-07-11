// this service will subscribe to the order queue and process the order by assign it to the available shipper
// and then notify the shipper to deliver the order, it should assign the order to the shipper with the least order, base on area, and time
import { ConsumeMessage } from 'amqplib';
import moment from 'moment';
import { OrderStatus } from '~constants/orderstatus.constant';
import { RABBITMQ_CONSTANT } from '~constants/rabbitmq.constant';
import { Area } from '~models/entities/area.entity';
import { Batch } from '~models/entities/batch.entity';
import { OrderBatch } from '~models/entities/order-batch.entity';
import { Order } from '~models/entities/order.entity';
import batchRepository from '~repositories/batch.repository';
import orderRepository from '~repositories/order.repository';
import orderBatchRepository from '~repositories/orderBatch.repository';
import {
	calDurationUntilNextTimeFrame,
	calDurationUntilTargetTime,
	combineDateAndTimeFrame
} from '~utils/date.util';
import {
	TIME_FRAME_INSTANT,
	TIME_FRAME_STANDARD
} from '~constants/timeframe.constant';
import RabbitMQUtil from '~utils/rabbitmq.util';
import { BatchStatus } from '~constants/batchstatus.constant';

class OrderProcessWorker {
	static instance: OrderProcessWorker;
	private rabbitmqInstance: RabbitMQUtil;

	static getInstance(rabbitmqInstance: RabbitMQUtil): OrderProcessWorker {
		if (!OrderProcessWorker.instance) {
			OrderProcessWorker.instance = new OrderProcessWorker(rabbitmqInstance);
		}
		return OrderProcessWorker.instance;
	}

	private constructor(rabbitmqInstance: RabbitMQUtil) {
		this.rabbitmqInstance = rabbitmqInstance;
		this.startSubscribing();
	}

	private async startSubscribing() {
		// subscribe to the order queue
		await this.rabbitmqInstance.subscribe(
			RABBITMQ_CONSTANT.QUEUE.ORDER_CREATE,
			(order) => this.handleCreatedOrder(order)
		);

		await this.rabbitmqInstance.subscribe(
			RABBITMQ_CONSTANT.QUEUE.ORDER_PROCESS,
			(order) => this.handleProcessOrder(order)
		);

		await this.rabbitmqInstance.subscribe(
			RABBITMQ_CONSTANT.QUEUE.ORDER_CANCEL,
			(order) => this.handleCancelOrder(order)
		);

		await this.rabbitmqInstance.subscribe(
			RABBITMQ_CONSTANT.QUEUE.ORDER_BATCH,
			(order) => this.handleAssignOrderToBatch(order)
		);
	}

	async handleCreatedOrder(msg: ConsumeMessage | null) {
		// subscribe to the order queue
		// get the order from the queue
		// convert msg to order
		// if order date is after 7pm, calculate the time to 7am the next day, send to delay queue

		const orderObj: Order = JSON.parse(msg!.content.toString());
		const order = await orderRepository.findOneBy({
			id: orderObj.id
		});

		if (!order) {
			return;
		}

		if (order.datetime.getHours() >= 19 || order.datetime.getHours() < 7) {
			const timeRemainingUntil7am = calDurationUntilTargetTime(
				new Date(),
				7,
				0,
				0
			);

			this.rabbitmqInstance.publishMessageToDelayQueue(
				RABBITMQ_CONSTANT.EXCHANGE.ORDER_PROCESS,
				RABBITMQ_CONSTANT.ROUTING_KEY.ORDER_PROCESS,
				JSON.stringify(order),
				timeRemainingUntil7am.asMilliseconds()
			);
		} else {
			this.rabbitmqInstance.publishMessage(
				RABBITMQ_CONSTANT.EXCHANGE.ORDER_PROCESS,
				RABBITMQ_CONSTANT.ROUTING_KEY.ORDER_PROCESS,
				JSON.stringify(order)
			);
		}
	}

	async handleProcessOrder(msg: ConsumeMessage | null) {
		// get the order from the queue
		// check priority and area of the order, assign to the appropriate queue
		const orderObj: Order = JSON.parse(msg!.content.toString());
		const order = await orderRepository.findOneBy({
			id: orderObj.id
		});

		if (!order) {
			return;
		}

		const priority = order.isPriority;

		const { timeUntilNextTimeFrame } = priority
			? calDurationUntilNextTimeFrame(order.datetime, TIME_FRAME_INSTANT)
			: calDurationUntilNextTimeFrame(order.datetime, TIME_FRAME_STANDARD);

		const priorityNumber = priority ? 1 : 0;

		this.rabbitmqInstance.publishMessageToDelayQueue(
			RABBITMQ_CONSTANT.EXCHANGE.ORDER_BATCH,
			RABBITMQ_CONSTANT.ROUTING_KEY.ORDER_BATCH,
			JSON.stringify(order),
			timeUntilNextTimeFrame.asMilliseconds(),
			priorityNumber
		);
	}

	async handleCancelOrder(msg: ConsumeMessage | null) {
		// get the order from the queue
		// cancel the order
		const data: Order = JSON.parse(msg!.content.toString());
		const order = await orderRepository.findOneBy({
			id: data.id
		});

		if (!order) {
			return;
		}

		if (order.status === OrderStatus.WAITING) {
			order.status = OrderStatus.CANCELED;
			orderRepository.update(order);
		}
	}

	async handleAssignOrderToBatch(msg: ConsumeMessage | null) {
		// get the order from the queue
		// assign the order to the shipper with the least order, base on area, and time
		const data: Order = JSON.parse(msg!.content.toString());
		const order = await orderRepository.findOne({
			where: {
				id: data.id
			},
			relations: ['area']
		});

		if (!order) {
			return;
		}

		const { nextTimeFrame } = order.isPriority
			? calDurationUntilNextTimeFrame(order.datetime, TIME_FRAME_INSTANT)
			: calDurationUntilNextTimeFrame(order.datetime, TIME_FRAME_STANDARD);

		// Combine current date and time frame to get datetime
		const datetime = combineDateAndTimeFrame(moment(), nextTimeFrame!.time);
		// Find or create a batch for that area
		let batch = await this.findCurrentAvailableBatch(order.area, datetime);
		if (!batch) {
			batch = new Batch();
			batch.area = order.area;
			batch.datetime = datetime.toDate();
			batch.status = BatchStatus.CREATED;
			batch = await batchRepository.create(batch);
		}

		// assign the order to the batch
		const orderBatch = new OrderBatch();
		orderBatch.batch = batch;
		orderBatch.order = order;
		orderBatch.status = OrderStatus.CREATED;
		orderBatch.datetime = datetime.toDate();

		await orderBatchRepository.create(orderBatch);
		// notify the shipper to deliver the order (send to the shipper queue)
	}

	private async findCurrentAvailableBatch(
		area: Area,
		datetime: moment.Moment
	): Promise<Batch | null> {
		const batch = await batchRepository.findOne({
			where: {
				area,
				datetime: datetime.toDate()
			},
			relations: ['orderBatches']
		});

		// If no batch found or batch is full, return null
		if (!batch || (batch && batch.orderBatches.length >= 10)) {
			return null;
		}

		return batch;
	}
}

export default OrderProcessWorker;
