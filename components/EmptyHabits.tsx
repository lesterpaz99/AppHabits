import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

export function EmptyHabits() {
	return (
		<View style={styles.container}>
			<Ionicons name='checkmark-circle-outline' size={64} color='#CBD5E1' />
			<ThemedText style={styles.title}>No habits yet</ThemedText>
			<ThemedText style={styles.subtitle}>
				Tap the button above to add your first habit
			</ThemedText>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 64,
		gap: 8,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
	},
	subtitle: {
		fontSize: 14,
		color: '#94A3B8',
		textAlign: 'center',
	},
});
