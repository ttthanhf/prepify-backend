import moment from 'moment';

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
	targetTime: Date
): moment.Duration => {
	const now = moment(initTime);
	const end = moment(targetTime);

	const duration = moment.duration(end.diff(now));

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

	const timeUntilNextTimeFrame = moment.duration(
		minTimeUntilNext * 60,
		'minutes'
	);
	return { timeUntilNextTimeFrame, nextTimeFrame: closestTimeFrame };
};

export default {
	formatDateToYYYYMMDDHHMMSS,
	calDurationUntilTargetTime,
	calDurationUntilNextTimeFrame
};
