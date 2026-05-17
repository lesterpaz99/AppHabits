import { useThemeColor } from '@/hooks/use-theme-color';
import { useState } from 'react';
import {
	FlatList,
	Pressable,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import { Screen } from './Screen';
import { ThemedText } from './themed-text';

const chips = [
	'Drink Water',
	'Read 10 mins',
	'Go for a walk',
	'Meditate for 5 mins',
	'Write in journal',
	'Stretch for 5 mins',
];

export default function QuickAddChips({
	onPick,
}: {
	onPick: (title: string) => void;
}) {
	const [selected, setSelected] = useState<string[]>([]);

	const surface = useThemeColor({}, 'surface');
	const border = useThemeColor({}, 'border');
	const text = useThemeColor({}, 'text');

	return (
		<Screen>
			<ThemedText
				style={{
					marginBottom: 16,
					color: text,
					fontWeight: 'bold',
				}}
			>
				Quick Suggestions
			</ThemedText>
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
				{chips.map((chip, index) => (
					<Pressable
						key={index}
						onPress={() => {
							onPick(chip);
							setSelected([...selected, chip]);
						}}
						style={{
							backgroundColor: surface,
							borderColor: border,
							borderWidth: 1,
							padding: 10,
							marginRight: 10,
							borderRadius: 20,
							height: 40,
						}}
					>
						<ThemedText style={{ color: text }}>{chip}</ThemedText>
					</Pressable>
				))}
			</ScrollView>
			<View>
				<ThemedText style={{ marginTop: 20, color: text }}>
					Your selections
				</ThemedText>
				{/* {selected.map((item, index) => (
					<ThemedText key={index} style={{ color: text }}>
						• {item}
					</ThemedText>
				))} */}
				<FlatList
					data={selected}
					renderItem={({ item }) => (
						<ThemedText style={{ color: text }}>• {item}</ThemedText>
					)}
					keyExtractor={(item) => item}
					ListEmptyComponent={() => <ThemedText>No selections yet.</ThemedText>}
				/>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	chipsContainer: {
		flexDirection: 'row',
		gap: 10,
	},
});
