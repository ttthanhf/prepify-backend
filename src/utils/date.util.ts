// import moment from 'moment';
import { TimeFrame } from '~constants/timeframe.constant';
import moment from 'moment-timezone';

// Set the default time zone to Vietnam
moment.tz.setDefault('Asia/Ho_Chi_Minh');

function formatDateToYYYYMMDDHHMMSS(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');
	return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export const calDurationUntilTargetTime = (
	initTime: Date,
	targetTime: moment.Moment
): moment.Duration => {
	const now = moment(initTime);

	// If now is after the target time, set target time to 7 AM the next day
	if (now.isAfter(targetTime)) {
		targetTime.add(1, 'day');
	}

	const duration = moment.duration(targetTime.diff(now));
	return duration;
};

export const calDurationUntilNextTimeFrame = (
	currentTime: Date,
	timeFrames: TimeFrame[]
): {
	timeUntilNextTimeFrame: moment.Duration;
	nextTimeFrame: TimeFrame | null;
} => {
	const now = moment(currentTime);
	const currentHour = now.hours() + now.minutes() / 60; // Current hour in decimal (e.g., 8:30 AM -> 8.5)

	let closestTimeFrame: TimeFrame | null = null;
	let minTimeUntilNext = Infinity;

	timeFrames.forEach((timeFrame) => {
		const timeUntil = timeFrame.startTime - currentHour;
		if (timeUntil > 0 && timeUntil < minTimeUntilNext) {
			minTimeUntilNext = timeUntil;
			closestTimeFrame = timeFrame;
		}
	});

	if (!closestTimeFrame) {
		closestTimeFrame = timeFrames[0];
		minTimeUntilNext = 24 - currentHour + closestTimeFrame.startTime;
	}

	const timeUntilNextTimeFrame = moment.duration(
		minTimeUntilNext * 60,
		'minutes'
	);
	return { timeUntilNextTimeFrame, nextTimeFrame: closestTimeFrame };
};

export const combineDateAndTimeFrame = (
	date: moment.Moment,
	time: moment.Moment
): moment.Moment => {
	return moment(
		date.format('YYYY-MM-DD') + ' ' + time.format('HH:mm:ss'),
		'YYYY-MM-DD HH:mm:ss'
	);
};

export const generateTimeFrames = (
	startHour: number,
	endHour: number,
	intervalMinutes: number
): TimeFrame[] => {
	const timeFrames: TimeFrame[] = [];
	let startTime = moment().hour(startHour).minute(0).second(0);
	const endTime = moment().hour(endHour).minute(0).second(0);

	while (startTime.isBefore(endTime)) {
		const timeFrame: TimeFrame = {
			name: startTime.format('h:mm A'),
			startTime: parseFloat(startTime.format('H.mm')),
			time: moment(startTime)
		};
		timeFrames.push(timeFrame);
		startTime.add(intervalMinutes, 'minutes');
	}

	return timeFrames;
};

export default {
	formatDateToYYYYMMDDHHMMSS,
	calDurationUntilTargetTime,
	calDurationUntilNextTimeFrame
};
