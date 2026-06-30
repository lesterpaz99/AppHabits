import QuickAddChips from '@/components/QuickAddChips';
import { ThemedView } from '@/components/themed-view';
import { useHabits } from '@/context/HabitContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
	const insets = useSafeAreaInsets();
	const { addHabit } = useHabits();

	const onPick = (title: string) => {
		addHabit(title, 'low');
	};

	return (
		<ThemedView style={{ flex: 1, padding: 20, paddingTop: insets.top + 20 }}>
			<QuickAddChips onPick={onPick} />
		</ThemedView>
	);
}

// const styles = StyleSheet.create({
// 	headerImage: {
// 		color: '#808080',
// 		bottom: -90,
// 		left: -35,
// 		position: 'absolute',
// 	},
// 	titleContainer: {
// 		flexDirection: 'row',
// 		gap: 8,
// 	},
// });
