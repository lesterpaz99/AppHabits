import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from './themed-view';

type Props = {
	children: React.ReactNode;
};

export function Screen({ children }: Props) {
	const insets = useSafeAreaInsets();

	return (
		<ThemedView
			style={[
				styles.screen,
				{
					paddingTop: insets.top + 16,
					paddingBottom: insets.bottom,
					paddingLeft: insets.left + 16,
					paddingRight: insets.right + 16,
				},
			]}
		>
			{children}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		gap: 16,
	},
});
