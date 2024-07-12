import moment from 'moment';
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

export const getWorkStartHour = async () => {
	const config = await configRepository.findOneBy({ type: 'workStartHour' });
	if (!config) {
		throw new Error('Missing configuration for work start hour');
	}
	return config.value;
};

export const getWorkEndHour = async () => {
	const config = await configRepository.findOneBy({ type: 'workEndHour' });
	if (!config) {
		throw new Error('Missing configuration for work end hour');
	}
	return config.value;
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
