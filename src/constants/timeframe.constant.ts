import moment from 'moment';
import { In } from 'typeorm';
import configRepository from '~repositories/config.repository';
import { generateTimeFrames } from '~utils/date.util';

export interface TimeFrame {
	name: string;
	startTime: number; // Start time in 24-hour format (e.g., 7.5 for 7:30 AM)
	time: moment.Moment;
}

export async function generateTimeFrameConfigs() {
	const configs = await configRepository.findAll();

	const timeframeInstantConfig = configs.find(
		(config) => config.type === 'timeframeInstant'
	);
	const timeframeStandardConfig = configs.find(
		(config) => config.type === 'timeframeStandard'
	);
	const workStartHourConfig = configs.find(
		(config) => config.type === 'workStartHour'
	);
	const workEndHourConfig = configs.find(
		(config) => config.type === 'workEndHour'
	);

	if (
		!timeframeInstantConfig ||
		!timeframeStandardConfig ||
		!workStartHourConfig ||
		!workEndHourConfig
	) {
		throw new Error('Missing configuration for timeframes');
	}

	const workStartHour = workStartHourConfig.value;
	const workEndHour = workEndHourConfig.value;

	const TIME_FRAME_INSTANT = generateTimeFrames(
		workStartHour,
		workEndHour,
		timeframeInstantConfig.value
	);
	const TIME_FRAME_STANDARD = generateTimeFrames(
		workStartHour,
		workEndHour,
		timeframeStandardConfig.value
	);

	return { TIME_FRAME_INSTANT, TIME_FRAME_STANDARD };
}

export const getWorkStartTime = async (): Promise<moment.Moment> => {
	const config = await configRepository.findBy({
		type: In(['workStartHour', 'workStartMinute'])
	});
	if (!config) {
		throw new Error('Missing configuration for work start hour');
	}

	const hour = config.filter((c) => c.type === 'workStartHour')[0].value;
	const minute = config.filter((c) => c.type === 'workStartMinute')[0].value;
	const result = moment().set({ hour, minute, second: 0, millisecond: 0 });

	return result;
};

export const getWorkEndTime = async (): Promise<moment.Moment> => {
	const config = await configRepository.findBy({
		type: In(['workEndHour', 'workEndMinute'])
	});
	if (!config) {
		throw new Error('Missing configuration for work end hour');
	}

	const hour = config.filter((c) => c.type === 'workEndHour')[0].value;
	const minute = config.filter((c) => c.type === 'workEndMinute')[0].value;

	const result = moment().set({ hour, minute, second: 0, millisecond: 0 });

	return result;
};

export const getCancelOrderDuration = async () => {
	const config = await configRepository.findOneBy({
		type: 'cancelOrderDuration'
	});
	if (!config) {
		throw new Error('Missing configuration for cancel order duration');
	}
	return config.value;
};

export const getMaximumOrdersInBatch = async () => {
	const config = await configRepository.findOneBy({
		type: 'maxOrdersInBatch'
	});

	if (!config) {
		throw new Error('Missing configuration for maximum orders in batch');
	}

	return config.value;
};
