import { Text, ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import GestureRecognizer from 'react-native-swipe-gestures';
import { AntDesign } from '@expo/vector-icons';
import { HabitField } from '../../components/HabitField';
import { RootStackParams } from '../../App';
import { useGetHabitsQuery, useGetHabitsStatsQuery } from '../../redux/features/habits';
import { dateFromNow } from '../../utils/formatDate';

export function HabitTrackerScreen(props: NativeStackScreenProps<RootStackParams, 'HabitsTracker'>) {
	const { navigation } = props;
	const [dayShift, setDayShift] = useState(0);
	const [uncheckedHabitsCount, setUncheckedHabitsCount] = useState<number>(null!);
	const { data, isLoading } = useGetHabitsQuery(dayShift);
	const { data: habitsStats } = useGetHabitsStatsQuery();

	useEffect(() => {
		if (data?.habits && data.habits.length > 0) {
			const uncheckedItem = data.habits.filter((item) => !item.checked);
			setUncheckedHabitsCount(uncheckedItem.length);
			return;
		}
		setUncheckedHabitsCount(null!);
	}, [data, dayShift]);

	if (!data?.habits && isLoading) {
		return (
			<View style={styles.loaderRoot}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	const onSwipeRight = () => setDayShift((prevState) => prevState - 1);
	const onSwipeLeft = () => {
		if (dayShift === 0) return;
		setDayShift((prevState) => prevState + 1);
	};
	const config = {
		velocityThreshold: 0.1,
		directionalOffsetThreshold: 10,
	};

	return (
		<GestureRecognizer config={config} onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
			<View style={[styles.firstRow, uncheckedHabitsCount === 0 ? styles.dayChecked : null]}>
				<View style={styles.dayPanel}>
					<Text>Day</Text>
					<View style={styles.habitsStreak}>
						<AntDesign name="star" size={24} color="#f0da37" />
						<Text>{habitsStats?.streak}</Text>
					</View>
				</View>
				<View style={styles.dayPanel}>
					<Text>{data?.date && dateFromNow(dayShift)}</Text>
				</View>
			</View>
			<View style={styles.scrollViewWrapper}>
				<ScrollView>
					{data!.habits.length > 0 ? (
						data!.habits.map((habit) => (
							<HabitField
								key={habit.id}
								habit={habit}
								dayShift={dayShift}
								navigation={navigation}
								shouldCheckDay={uncheckedHabitsCount === 1}
							/>
						))
					) : (
						<View>
							<Text>No Tasks screen</Text>
						</View>
					)}
				</ScrollView>
			</View>
		</GestureRecognizer>
	);
}

const styles = StyleSheet.create({
	firstRow: {
		flexDirection: 'row',
	},
	dayChecked: {
		backgroundColor: '#84fa92',
	},
	dayPanel: {
		height: 100,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	habitsStreak: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	scrollViewWrapper: {
		height: '84%',
	},
	loaderRoot: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
