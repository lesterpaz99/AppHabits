import {
	HABIT_PRIORITIES,
	type Habit,
	type HabitPriority,
} from '@/types/Habit';
import { isSameDay, isYesterday, toISO } from '@/utils/date';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type State = { loading: boolean; error: string | null; habits: Habit[] };

export type HabitsCtx = {
	state: State;
	addHabit: (title: string, priority: HabitPriority) => void;
	toggleHabit: (id: string) => void;
	deleteHabit: (id: string) => void;
};

export type Action =
	| { type: 'HYDRATE'; payload: Habit[] }
	| { type: 'ADD_HABIT'; title: string; priority: HabitPriority }
	| { type: 'TOGGLE_HABIT'; id: string }
	| { type: 'DELETE_HABIT'; id: string }
	| { type: 'SET_ERROR'; error: string | null };

const STORAGE_KEY = 'habits:v1';

const initialState: State = {
	loading: true,
	error: null,
	habits: [],
};

const isHabit = (value: unknown): value is Habit => {
	if (!value || typeof value !== 'object') return false;

	const habit = value as Partial<Habit>;

	return (
		typeof habit.id === 'string' &&
		typeof habit.title === 'string' &&
		typeof habit.streak === 'number' &&
		typeof habit.isCompleted === 'boolean' &&
		HABIT_PRIORITIES.includes(habit.priority as HabitPriority) &&
		typeof habit.createdAt === 'string' &&
		(typeof habit.lastDoneAt === 'string' || habit.lastDoneAt === null)
	);
};

const parseStoredHabits = (storedValue: string | undefined): Habit[] => {
	if (!storedValue) return [];

	const parsed = JSON.parse(storedValue) as unknown;

	if (!Array.isArray(parsed) || !parsed.every(isHabit)) {
		throw new Error('Stored habits have an invalid format.');
	}

	return parsed;
};

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'HYDRATE':
			return {
				...state,
				loading: false,
				error: null,
				habits: action.payload,
			};
		case 'ADD_HABIT': {
			const now = new Date();
			const newHabit: Habit = {
				id: `h-${Date.now()}`,
				title: action.title,
				streak: 0,
				createdAt: toISO(now),
				lastDoneAt: null,
				isCompleted: false,
				priority: action.priority,
			};
			return { ...state, habits: [...state.habits, newHabit] };
		}
		case 'TOGGLE_HABIT': {
			const { id } = action;
			const today = new Date();
			const todayISO = toISO(today);

			const toggledHabits = state.habits.map((h) => {
				if (h.id !== id) return h;

				const last = h.lastDoneAt ? new Date(h.lastDoneAt) : null;
				const doneToday = last ? isSameDay(last, today) : false;

				if (doneToday) {
					return {
						...h,
						streak: Math.max(h.streak - 1, 0),
						isCompleted: false,
						lastDoneAt: null,
					};
				}

				const newStreak = last && isYesterday(today, last) ? h.streak + 1 : 1;

				return {
					...h,
					streak: newStreak,
					isCompleted: true,
					lastDoneAt: todayISO,
				};
			});
			return { ...state, habits: toggledHabits };
		}
		case 'DELETE_HABIT': {
			const filteredHabits = state.habits.filter(
				(habit) => habit.id !== action.id
			);
			return { ...state, habits: filteredHabits };
		}
		case 'SET_ERROR':
			return { ...state, error: action.error };
		default:
			return state;
	}
};

const HabitContext = createContext<HabitsCtx | null>(null);

export function HabitsProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		(async () => {
			try {
				const stored = await AsyncStorage.getItem(STORAGE_KEY);
				const storedHabits = parseStoredHabits(stored ?? undefined);
				dispatch({ type: 'HYDRATE', payload: storedHabits });
			} catch (error) {
				dispatch({ type: 'HYDRATE', payload: [] });
				dispatch({
					type: 'SET_ERROR',
					error:
						error instanceof Error
							? error.message
							: 'Unable to load stored habits.',
				});
			}
		})();
	}, []);

	useEffect(() => {
		if (state.loading) return;

		AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.habits));
	}, [state.habits, state.loading]);

	const addHabit = useCallback((title: string, priority: HabitPriority) => {
		dispatch({ type: 'ADD_HABIT', title, priority });
	}, []);

	const toggleHabit = useCallback((id: string) => {
		dispatch({ type: 'TOGGLE_HABIT', id });
	}, []);

	const deleteHabit = useCallback((id: string) => {
		dispatch({ type: 'DELETE_HABIT', id });
	}, []);

	const value = useMemo(
		() => ({
			state,
			addHabit,
			toggleHabit,
			deleteHabit,
		}),
		[state, addHabit, toggleHabit, deleteHabit]
	);

	return (
		<HabitContext.Provider value={value}>{children}</HabitContext.Provider>
	);
}

export function useHabits() {
	const context = useContext(HabitContext);

	if (!context) {
		throw new Error('useHabits must be used inside HabitsProvider.');
	}

	return context;
}

export { initialState, reducer, STORAGE_KEY };
