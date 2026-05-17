import { AddHabitModal } from '@/components/AddHabitModal';
import { HabitCard } from '@/components/HabitCard';
import { HabitGreeting } from '@/components/HabitGreeting';
import ProfileHeader from '@/components/ProfileHeader';
import { Screen } from '@/components/Screen';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

type Priority = 'low' | 'mid' | 'high';

type Habit = {
	id: string;
	title: string;
	streak: number;
	isCompleted: boolean;
	priority: Priority;
};

const INITIAL_HABITS: Habit[] = [
	{
		id: 'h1',
		title: 'Morning Run',
		streak: 0,
		isCompleted: true,
		priority: 'mid',
	},
	{
		id: 'h2',
		title: 'Read a Book',
		streak: 3,
		isCompleted: false,
		priority: 'low',
	},
];

export default function HomeScreen() {
	const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
	const [addModalVisible, setAddModalVisible] = useState(false);

	const toggle = useCallback((id: string) => {
		setHabits((prev) =>
			prev.map((habit) => {
				if (habit.id !== id) return habit;
				const completing = !habit.isCompleted;
				return {
					...habit,
					isCompleted: completing,
					streak: completing ? habit.streak + 1 : Math.max(habit.streak - 1, 0),
				};
			})
		);
	}, []);

	const addHabit = useCallback((title: string, priority: Priority) => {
		const newHabit: Habit = {
			id: 'h' + Date.now(),
			title,
			streak: 0,
			isCompleted: false,
			priority,
		};
		setHabits((prev) => [...prev, newHabit]);
	}, []);

	const completedItems = useMemo(
		() => habits.filter((h) => h.isCompleted).length,
		[habits]
	);

	const openHabit = (id: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		toggle(id);
	};

	return (
		<Screen>
			<ProfileHeader name='Lester' role='Software Engineer' />
			<HabitGreeting userName='Lester' />

			<TouchableOpacity
				style={styles.addButton}
				activeOpacity={0.6}
				onPress={() => setAddModalVisible(true)}
			>
				<Ionicons name='add' size={24} color='#64748B' />
			</TouchableOpacity>

			<AddHabitModal
				visible={addModalVisible}
				onClose={() => setAddModalVisible(false)}
				onAdd={addHabit}
			/>

			<FlatList
				data={habits}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => (
					<HabitCard
						title={item.title}
						streak={item.streak}
						isCompleted={item.isCompleted}
						priority={item.priority}
						onToggle={() => openHabit(item.id)}
					/>
				)}
			/>
		</Screen>
	);
}

const styles = StyleSheet.create({
	addButton: {
		width: '100%',
		height: 56,
		borderWidth: 1.5,
		borderStyle: 'dashed',
		borderColor: '#94A3B8',
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
		opacity: 0.6,
		marginTop: 8,
	},
});
