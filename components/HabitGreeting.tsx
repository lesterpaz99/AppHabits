import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

export function HabitGreeting({ userName = 'User' }) {
	const date = new Date();
	const hours = date.getHours();

	let greeting =
		hours < 12
			? 'Good morning'
			: hours < 18
				? 'Good afternoon'
				: 'Good evening';

	return (
		<View style={styles.greeting}>
			<ThemedText style={styles.title}>
				{greeting}, {userName}!
			</ThemedText>
			<ThemedText style={[styles.subtitle, { color: '#64748B' }]}>
				Today is{' '}
				{date.toLocaleDateString(undefined, {
					weekday: 'long',
					month: 'long',
					day: 'numeric',
				})}
			</ThemedText>
		</View>
	);
}

const styles = StyleSheet.create({
	greeting: {
		fontSize: 18,
		fontWeight: '600',
		// color: '#0F172A',
		alignItems: 'flex-start',
		gap: 4,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		// color: '#0F172A',
	},
	subtitle: {
		fontSize: 16,
		// color: '#64748B',
	},
});
