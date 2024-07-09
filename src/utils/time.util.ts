import moment from 'moment';

export function timeUntil(initTime: Date, targetTime: Date): moment.Duration {
	const now = moment(initTime);
	const end = moment(targetTime);

	const duration = moment.duration(end.diff(now));

	return duration;
}
