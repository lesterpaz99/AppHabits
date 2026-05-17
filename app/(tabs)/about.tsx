import { StyleSheet, Text, View } from 'react-native';

export default function About() {
	const myName = 'Obed';
	const age = 26;
	const isPremium = true;
	const messages = 5;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>About me</Text>
			<Text style={styles.infoText}>Name: {myName}</Text>
			<Text style={styles.infoText}>Age in ten years: {age + 10}</Text>
			<Text style={styles.badge}>
				User {isPremium ? 'Premium' : 'Freemium'}
			</Text>
			{messages > 0 && (
				<Text style={styles.infoText}>You have {messages} messages</Text>
			)}
			<Text style={styles.subtitle}>Lets do this</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FAFAFA',
		padding: 32,
		gap: 12,
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
		color: '#111111',
		letterSpacing: -0.5,
		marginBottom: 8,
	},
	infoText: {
		fontSize: 15,
		color: '#555555',
		letterSpacing: 0.1,
	},
	badge: {
		fontSize: 13,
		color: '#888888',
		borderWidth: 1,
		borderColor: '#DDDDDD',
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 20,
		overflow: 'hidden',
	},
	subtitle: {
		fontSize: 13,
		color: '#AAAAAA',
		marginTop: 8,
		letterSpacing: 0.5,
	},
});
