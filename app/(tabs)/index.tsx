import { AddHabitModal } from '@/components/AddHabitModal';
import { EmptyHabits } from '@/components/EmptyHabits';
import { HabitCard } from '@/components/HabitCard';
import { HabitGreeting } from '@/components/HabitGreeting';
import ProfileHeader from '@/components/ProfileHeader';
import { Screen } from '@/components/Screen';
import { useCelebration } from '@/context/CelebrationProvider';
import { useHabits } from '@/context/HabitContext';
import type { Habit } from '@/types/Habit';
import { isSameDay } from '@/utils/date';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import {
	FlatList,
	ListRenderItemInfo,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

export default function HomeScreen() {
	const {
		state: { habits, loading },
		addHabit,
		toggleHabit,
	} = useHabits();
	const { celebrate } = useCelebration();
	const [addModalVisible, setAddModalVisible] = useState(false);

	const keyExtractor = useCallback((item: Habit) => item.id, []);

	const openHabit = useCallback(
		(id: string) => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			toggleHabit(id);
			// celebrate('Great job on completing your habit!');
		},
		[toggleHabit]
	);

	const onToggleWithCelebration = (item: Habit) => {
		const wasToday = item.lastDoneAt
			? isSameDay(new Date(item.lastDoneAt), new Date())
			: false;

		toggleHabit(item.id);

		if (!item.isCompleted && !wasToday) {
			celebrate('Great job on completing your habit!');
		}
	};

	const renderItem = ({ item }: ListRenderItemInfo<Habit>) => {
		const isToday = item.lastDoneAt
			? isSameDay(new Date(item.lastDoneAt), new Date())
			: false;

		return (
			<HabitCard
				title={item.title}
				streak={item.streak}
				isCompleted={isToday}
				priority={item.priority}
				onToggle={() => onToggleWithCelebration(item)}
			/>
		);
	};

	if (loading) return null;

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
				keyExtractor={keyExtractor}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={EmptyHabits}
				renderItem={renderItem}
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
