import moment from 'moment';

export interface TimeFrame {
	name: string;
	startTime: number; // Start time in 24-hour format (e.g., 7.5 for 7:30 AM)
	time: moment.Moment;
}

export const TIME_FRAME_INSTANT: TimeFrame[] = [
	{ name: '9:00 AM', startTime: 9.0, time: moment('09:00', 'HH:mm') },
	{ name: '11:00 AM', startTime: 11.0, time: moment('11:00', 'HH:mm') },
	{ name: '1:00 PM', startTime: 13.0, time: moment('13:00', 'HH:mm') },
	{ name: '3:00 PM', startTime: 15.0, time: moment('15:00', 'HH:mm') },
	{ name: '5:00 PM', startTime: 17.0, time: moment('17:00', 'HH:mm') },
	{ name: '7:00 PM', startTime: 19.0, time: moment('19:00', 'HH:mm') }
];

export const TIME_FRAME_STANDARD: TimeFrame[] = [
	{ name: '7:00 AM', startTime: 7.0, time: moment('07:00', 'HH:mm') },
	{ name: '11:00 AM', startTime: 11.0, time: moment('11:00', 'HH:mm') },
	{ name: '3:00 PM', startTime: 15.0, time: moment('15:00', 'HH:mm') },
	{ name: '7:00 PM', startTime: 19.0, time: moment('19:00', 'HH:mm') }
];
