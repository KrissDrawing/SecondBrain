import { Text, ScrollView, StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
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
			<View style={{ height: '70%' }}>
				<ScrollView>
					{data?.map((habit) => (
						<View style={styles.habitRow} key={habit.id}>
							<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#abc' }}>
								<HabitField habit={habit.name} />
							</View>
							<Pressable
								style={[styles.habitCheck, habit.checked ? styles.checkedHabit : styles.uncheckedHabit]}
								onPress={() =>
									navigation.navigate('HabitCheckModal', {
										habitId: habit.id,
									})
								}>
								{habit.checked ? (
									<FontAwesome style={styles.checkedIcon} name="check-square" size={50} color="black" />
								) : (
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<MaterialCommunityIcons
											style={styles.checkedIcon}
											name="clipboard-text-clock-outline"
											size={50}
											color="black"
										/>
										{}
										<Text>{habit.started_at && format(new Date(habit.started_at), 'HH:mm')}</Text>
									</View>
								)}
							</Pressable>
						</View>
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
	loaderRoot: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	habitRow: {
		flexDirection: 'row',
	},
	addHabit: {
		flexDirection: 'row',
	},
	habitCheck: {
		display: 'flex',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 100,
	},
	textInput: {
		flex: 0,
		color: 'white',
		backgroundColor: '#333',
		width: 300,
	},
	habitField: {
		color: 'red',
	},
	checkedHabit: {
		backgroundColor: '#84fa92',
		color: 'red',
	},
	checkedIcon: {
		opacity: 0.7,
		margin: 5,
	},
	uncheckedHabit: {
		backgroundColor: '#689399',
	},
});
