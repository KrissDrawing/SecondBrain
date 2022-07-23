import { Text, ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { HabitField } from '../../components/HabitField';
import { RootStackParams } from '../../App';
import { useGetHabitsQuery } from '../../redux/features/habits';

export function HabitTrackerScreen(props: NativeStackScreenProps<RootStackParams, 'HabitsTracker'>) {
	const { navigation } = props;
	const { data, isLoading } = useGetHabitsQuery();

	if (!data && isLoading) {
		return (
			<View style={styles.loaderRoot}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<View>
			<View style={styles.firstRow}>
				<View style={styles.dayPanel}>
					<Text>Day</Text>
				</View>
				<View style={styles.dayPanel}>
					<Text>{format(new Date(), 'ccc, dd LLL')}</Text>
				</View>
			</View>
			<View style={styles.scrollViewWrapper}>
				<ScrollView>
					{data?.map((habit) => (
						<HabitField key={habit.id} habit={habit} navigation={navigation} />
					))}
				</ScrollView>
			</View>
		</View>
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
