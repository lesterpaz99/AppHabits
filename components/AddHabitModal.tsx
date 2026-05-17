import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Priority = 'low' | 'mid' | 'high';

type Props = {
	visible: boolean;
	onClose: () => void;
	onAdd: (title: string, priority: Priority) => void;
};

const priorityColors: Record<
	Priority,
	{ backgroundColor: string; color: string }
> = {
	low: { backgroundColor: '#D1FAE5', color: '#10B981' },
	mid: { backgroundColor: '#FBBF24', color: '#000000' },
	high: { backgroundColor: '#EF4444', color: '#FFFFFF' },
};

const PRIORITIES: Priority[] = ['low', 'mid', 'high'];

const DISMISS_THRESHOLD = 150;

export function AddHabitModal({ visible, onClose, onAdd }: Props) {
	const [title, setTitle] = useState('');
	const [priority, setPriority] = useState<Priority>('low');
	const [showError, setShowError] = useState(false);

	const insets = useSafeAreaInsets();

	// Tracks how far the sheet has been dragged downward
	const translateY = useSharedValue(0);

	const handleChangeTitle = (text: string) => {
		setTitle(text);
		if (showError) setShowError(false);
	};

	const handleClose = () => {
		translateY.value = 0; // reset position for next open
		setTitle('');
		setPriority('low');
		setShowError(false);
		onClose();
	};

	const handleAdd = () => {
		if (!title.trim()) {
			setShowError(true);
			return;
		}
		onAdd(title.trim(), priority);
		translateY.value = 0;
		setTitle('');
		setPriority('low');
		onClose();
	};

	// Pan gesture — only allows dragging downward
	const panGesture = Gesture.Pan()
		.runOnJS(true)
		.onUpdate((e) => {
			if (e.translationY > 0) {
				translateY.value = e.translationY;
			}
		})
		.onEnd((e) => {
			if (e.translationY > DISMISS_THRESHOLD) {
				handleClose();
			} else {
				translateY.value = withSpring(0, { damping: 50 });
			}
		});

	const animatedSheetStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	return (
		<Modal
			visible={visible}
			animationType='slide'
			transparent
			onRequestClose={handleClose}
		>
			<KeyboardAvoidingView
				style={[styles.overlay, { marginTop: insets.top + 16 }]}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<GestureDetector gesture={panGesture}>
					<Animated.View
						style={[
							styles.sheet,
							{ paddingBottom: insets.bottom, paddingTop: 12 },
							animatedSheetStyle,
						]}
					>
						{/* Drag handle — visual affordance for swipe to dismiss */}
						<View style={styles.dragHandle} />

						<View style={styles.header}>
							<Text style={styles.headerTitle}>New Habit</Text>
							<TouchableOpacity onPress={handleClose} hitSlop={8}>
								<Ionicons name='close' size={22} color='#64748B' />
							</TouchableOpacity>
						</View>

						<Text style={styles.label}>Habit name</Text>
						<TextInput
							style={styles.input}
							placeholder='e.g. Morning Run'
							placeholderTextColor='#94A3B8'
							value={title}
							onChangeText={handleChangeTitle}
							returnKeyType='done'
							onSubmitEditing={handleAdd}
							autoFocus
						/>

						<View style={styles.priorityRow}>
							{PRIORITIES.map((p) => {
								const isSelected = priority === p;
								const colors = priorityColors[p];
								return (
									<Pressable
										key={p}
										onPress={() => setPriority(p)}
										style={[
											styles.priorityBtn,
											{
												backgroundColor: isSelected
													? colors.backgroundColor
													: '#F1F5F9',
												borderColor: isSelected ? colors.color : '#E2E8F0',
											},
										]}
									>
										<Text
											style={[
												styles.priorityLabel,
												{ color: isSelected ? colors.color : '#64748B' },
											]}
										>
											{p.charAt(0).toUpperCase() + p.slice(1)} Priority
										</Text>
									</Pressable>
								);
							})}
						</View>

						<TouchableOpacity
							style={[styles.addBtn, !title.trim() && styles.addBtnDisabled]}
							onPress={handleAdd}
							disabled={!title.trim()}
						>
							<Text style={styles.addBtnText}>Add Habit</Text>
						</TouchableOpacity>

						{showError && (
							<Text style={styles.error}>Habit name cannot be empty.</Text>
						)}
					</Animated.View>
				</GestureDetector>
			</KeyboardAvoidingView>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
	},
	sheet: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		borderTopRightRadius: 32,
		borderTopLeftRadius: 32,
		padding: 24,
		gap: 12,
	},
	dragHandle: {
		width: 40,
		height: 4,
		borderRadius: 2,
		backgroundColor: '#CBD5E1',
		alignSelf: 'center',
		marginBottom: 8,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#0F172A',
	},
	label: {
		fontSize: 13,
		fontWeight: '600',
		color: '#64748B',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	input: {
		borderWidth: 1,
		borderColor: '#E2E8F0',
		borderRadius: 12,
		padding: 14,
		fontSize: 16,
		color: '#0F172A',
	},
	priorityRow: {
		flexDirection: 'row',
		gap: 8,
		marginTop: 4,
	},
	priorityBtn: {
		borderWidth: 1,
		borderRadius: 12,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	priorityLabel: {
		fontWeight: '600',
	},
	addBtn: {
		backgroundColor: '#2563EB',
		borderRadius: 14,
		padding: 16,
		alignItems: 'center',
		marginTop: 8,
	},
	addBtnDisabled: {
		backgroundColor: '#BFDBFE',
	},
	addBtnText: {
		color: '#FFFFFF',
		fontWeight: '700',
		fontSize: 16,
	},
	error: {
		color: '#EF4444',
	},
});
