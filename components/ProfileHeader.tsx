import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

export default function ProfileHeader({
	name,
	role,
}: {
	name: string;
	role: string;
}) {
	const card = useThemeColor({}, 'surface');
	const primary = useThemeColor({}, 'primary');
	const onPrimary = useThemeColor({}, 'onPrimary');

	const initials = name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase();

	return (
		<View style={[styles.card, { backgroundColor: card }]}>
			<View style={[styles.avatar, { backgroundColor: primary }]}>
				<ThemedText style={[styles.avatarText, { color: onPrimary }]}>
					{initials}
				</ThemedText>
			</View>
			<View>
				<ThemedText style={styles.name}>{name}</ThemedText>
				<ThemedText style={styles.role}>{role}</ThemedText>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 20,
		borderRadius: 12,
		gap: 16,
		marginBottom: 16,
	},
	name: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	role: {
		fontSize: 16,
		// color: '#64748B',
	},
	avatar: {
		width: 64,
		height: 64,
		borderRadius: 32,
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarText: {
		fontSize: 24,
		fontWeight: 'bold',
	},
});
