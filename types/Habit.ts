export const HABIT_PRIORITIES = ['low', 'mid', 'high'] as const;

export type HabitPriority = (typeof HABIT_PRIORITIES)[number];

export type Habit = {
	id: string;
	title: string;
	streak: number;
	isCompleted: boolean;
	priority: HabitPriority;
	createdAt: string; // ISO string
	lastDoneAt: string | null; // ISO string or null
};

export type AddHabitHandler = (title: string, priority: HabitPriority) => void;

export type HabitCardProps = {
	title: Habit['title'];
	streak: Habit['streak'];
	isCompleted?: Habit['isCompleted'];
	priority?: Habit['priority'];
	onToggle?: () => void;
};
