import { useThemeColor } from '@/hooks/use-theme-color';
import type { HabitCardProps, HabitPriority } from '@/types/Habit';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemedText } from './themed-text';

const priorityColors: Record<
	HabitPriority,
	{ backgroundColor: string; color: string }
> = {
	low: {
		backgroundColor: '#D1FAE5',
		color: '#10B981',
	},
	mid: {
		backgroundColor: '#FBBF24',
		color: '#000000',
	},
	high: {
		backgroundColor: '#EF4444',
		color: '#FFFFFF',
	},
};

export function HabitCard({
	title,
	streak,
	isCompleted = false,
	priority = 'low',
	onToggle,
}: HabitCardProps) {
	const p = priorityColors[priority];
	const surface = useThemeColor({}, 'surface');
	const success = useThemeColor({}, 'success');
	const border = useThemeColor({}, 'border');

	return (
		<Pressable
			onPress={onToggle}
			style={({ pressed }) => [
				styles.card,
				{ backgroundColor: surface, borderColor: border },
				isCompleted && styles.cardDone,
				pressed ? { opacity: 0.9 } : { opacity: 1 },
			]}
		>
			<View style={styles.row}>
				<ThemedText style={styles.title}>{title}</ThemedText>
				{isCompleted && <Text style={styles.badge}>✅</Text>}
			</View>
			<View style={styles.row}>
				<ThemedText
					style={[
						styles.badge,
						{ backgroundColor: p.backgroundColor, color: p.color },
					]}
				>
					{priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
				</ThemedText>
				<ThemedText style={styles.streak}>
					{streak > 2 && `🔥 `}
					{streak > 0 ? `${streak} day${streak > 1 ? 's' : ''} streak` : ''}
				</ThemedText>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		// backgroundColor: '#E0E7FF',
		padding: 16,
		paddingLeft: 14,
		paddingRight: 14,
		borderRadius: 12,
		marginBottom: 12,
		// borderColor: '#C7D2FE',
		borderWidth: 1,
		// soft shadow all around the card
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	cardDone: {
		// backgroundColor: '#C7D2FE',
		// borderColor: '#34D399',
		// borderWidth: 2,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		marginBottom: 4,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		// color: '#0F172A',
	},
	badge: {
		// backgroundColor: '#34D399',
		// color: '#34D399',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		fontSize: 12,
		fontWeight: '500',
	},
	streak: {
		fontSize: 14,
		// color: '#64748B',
	},
});
