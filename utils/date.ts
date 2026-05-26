export const startOfDay = (date: Date) => {
	const currentDate = new Date(date);
	currentDate.setHours(0, 0, 0, 0);
	return currentDate;
};

export const isSameDay = (firstDate: Date, secondDate: Date) =>
	startOfDay(firstDate).getTime() === startOfDay(secondDate).getTime();

export const isYesterday = (ref: Date, candidate: Date) => {
	const yesterday = startOfDay(ref);
	yesterday.setDate(yesterday.getDate() - 1);

	return isSameDay(yesterday, candidate);
};

export const toISO = (date: Date) => startOfDay(date).toISOString();
