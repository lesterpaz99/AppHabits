import * as Haptics from 'expo-haptics';
import React, {
	createContext,
	useCallback,
	useContext,
	useRef,
	useState,
} from 'react';
import {
	AccessibilityInfo,
	Animated,
	Easing,
	StyleSheet,
	useWindowDimensions,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

import { ThemedText } from '@/components/themed-text';

type ConfettiContext = {
	celebrate: (message?: string) => void;
};

const COLORS = [
	'#FF6B6B',
	'#FFD93D',
	'#6BCB77',
	'#4D96FF',
	'#FF922B',
	'#CC5DE8',
];

// Must be longer than any cannon's fallSpeed so we don't unmount mid-animation
const CONFETTI_LIFETIME_MS = 4500;

const CelebrationContext = createContext<ConfettiContext>({
	celebrate: () => {},
});
export const useCelebration = () => useContext(CelebrationContext);

export const CelebrationProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [visible, setVisible] = useState<boolean>(false);
	const [message, setMessage] = useState<string | undefined>(undefined);
	const toastOpacity = useRef(new Animated.Value(0)).current;
	const toastScale = useRef(new Animated.Value(0.75)).current;
	const lockRef = useRef<boolean>(false);
	const { width } = useWindowDimensions();

	const celebrate = useCallback(
		(message?: string) => {
			(async () => {
				if (lockRef.current) return;

				lockRef.current = true;
				setMessage(message);
				setVisible(true);

				try {
					await Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Success
					);
				} catch {}

				try {
					AccessibilityInfo.announceForAccessibility?.(
						message || 'Habit completed!'
					);
				} catch {}

				// Toast pops in with scale + fade
				Animated.parallel([
					Animated.timing(toastOpacity, {
						toValue: 1,
						duration: 220,
						easing: Easing.out(Easing.ease),
						useNativeDriver: true,
					}),
					Animated.spring(toastScale, {
						toValue: 1,
						tension: 90,
						friction: 7,
						useNativeDriver: true,
					}),
				]).start();

				// Fade toast out after a hold — independently of confetti
				setTimeout(() => {
					Animated.parallel([
						Animated.timing(toastOpacity, {
							toValue: 0,
							duration: 700,
							easing: Easing.in(Easing.quad),
							useNativeDriver: true,
						}),
						Animated.timing(toastScale, {
							toValue: 0.85,
							duration: 700,
							easing: Easing.in(Easing.quad),
							useNativeDriver: true,
						}),
					]).start();
				}, 1800);

				// Unmount only after confetti has fully finished falling
				setTimeout(() => {
					toastOpacity.setValue(0);
					toastScale.setValue(0.75);
					setVisible(false);
					setMessage(undefined);
					lockRef.current = false;
				}, CONFETTI_LIFETIME_MS);
			})();
		},
		[toastOpacity, toastScale]
	);

	return (
		<CelebrationContext.Provider value={{ celebrate }}>
			{children}
			{visible && (
				<Animated.View
					pointerEvents='none'
					style={[StyleSheet.absoluteFillObject, styles.overlay]}
				>
					{/* Three cannons spread across the top — staggered slightly for a natural shower */}
					<ConfettiCannon
						count={50}
						origin={{ x: 0, y: 0 }}
						explosionSpeed={150}
						fallSpeed={3800}
						fadeOut
						autoStart
						autoStartDelay={0}
						colors={COLORS}
					/>
					<ConfettiCannon
						count={70}
						origin={{ x: width / 2, y: 0 }}
						explosionSpeed={350}
						fallSpeed={4000}
						fadeOut
						autoStart
						autoStartDelay={100}
						colors={COLORS}
					/>
					<ConfettiCannon
						count={50}
						origin={{ x: width, y: 0 }}
						explosionSpeed={250}
						fallSpeed={3800}
						fadeOut
						autoStart
						autoStartDelay={50}
						colors={COLORS}
					/>

					<Animated.View
						style={[
							styles.toast,
							{ opacity: toastOpacity, transform: [{ scale: toastScale }] },
						]}
					>
						<ThemedText style={styles.toastText}>
							{message || 'Habit completed! 🎉'}
						</ThemedText>
					</Animated.View>
				</Animated.View>
			)}
		</CelebrationContext.Provider>
	);
};

const styles = StyleSheet.create({
	overlay: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	toast: {
		position: 'absolute',
		bottom: 100,
		paddingHorizontal: 20,
		paddingVertical: 14,
		borderRadius: 16,
		backgroundColor: 'rgba(0, 0, 0, 0.75)',
	},
	toastText: {
		color: '#fff',
		fontWeight: '700',
		fontSize: 16,
	},
});
