import { add, format, isValid } from 'date-fns';

export const dateFromNow = (days?: number) => format(add(new Date(), { days: days ?? 0 }), 'yyyy-LL-dd');

export const formatTime = (time?: string | Date) => {
	if (!isValid(time)) return '00:00';
	if (!time) return '00:00';
	if (typeof time === 'string') return format(new Date(time), 'HH:mm');
	return format(time, 'HH:mm');
};

export const durationFromPicker = (time?: string | Date) => {
	if (!isValid(time)) return null;
	if (!time) return null;
	if (typeof time === 'string') {
		const DateTime = new Date(time);
		return DateTime.getHours() * 60 + DateTime.getMinutes();
	}
	return time.getHours() * 60 + time.getMinutes();
};
