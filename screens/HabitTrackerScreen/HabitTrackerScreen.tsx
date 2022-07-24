import { Text, ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import GestureRecognizer from 'react-native-swipe-gestures';
import { HabitField } from '../../components/HabitField';
import { RootStackParams } from '../../App';
import { useGetHabitsQuery } from '../../redux/features/habits';
import { dateFromNow } from '../../utils/formatDate';

export function HabitTrackerScreen(props: NativeStackScreenProps<RootStackParams, 'HabitsTracker'>) {
	const { navigation } = props;
	const [dayShift, setDayShift] = useState(0);
	const { data, isLoading } = useGetHabitsQuery(dayShift);

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
			<View style={styles.firstRow}>
				<View style={styles.dayPanel}>
					<Text>Day</Text>
				</View>
				<View style={styles.dayPanel}>
					<Text>{data?.date && dateFromNow(dayShift)}</Text>
				</View>
			</View>
			<View style={styles.scrollViewWrapper}>
				<ScrollView>
					{data!.habits.length > 0 ? (
						data!.habits.map((habit) => (
							<HabitField key={habit.id} habit={habit} dayShift={dayShift} navigation={navigation} />
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
	dayPanel: {
		backgroundColor: 'white',
		height: 100,
		flex: 1,
		justifyContent: 'center',
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
