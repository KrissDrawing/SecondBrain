import {
	Text,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
	NativeSyntheticEvent,
	TextInputChangeEventData,
	Button,
	Pressable,
	ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import { HabitField } from '../../components/HabitField';
import { RootStackParams } from '../../App';
import { useAddHabitMutation, useGetHabitsQuery } from '../../redux/features/habits';

export function HabitTrackerScreen(props: NativeStackScreenProps<RootStackParams, 'HabitsTracker'>) {
	const { navigation } = props;
	const [habitName, setHabitName] = useState('');

	const { data, error, isLoading } = useGetHabitsQuery();
	const [addHabit, { isLoading: addHabitLoading }] = useAddHabitMutation();

	const handleHabitChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
		setHabitName(e.nativeEvent.text);
	};

	const handleAddHabit = () => {
		void addHabit({ name: habitName, checked: false });
		// TODO: handle errors
	};

	if (!data && isLoading) {
		return (
			<View style={styles.loaderRoot}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<View>
			<View style={styles.addHabit}>
				<>
					<TextInput value={habitName} style={styles.textInput} onChange={handleHabitChange} />
					<Button title="Add" disabled={addHabitLoading} onPress={handleAddHabit} />
				</>
			</View>
			<View style={styles.firstRow}>
				<View style={styles.dayPanel}>
					<Text>Dzień</Text>
				</View>
				<View style={styles.dayPanel}>
					{/* eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */}
					<Text>{DateTime.now().toFormat('ccc, dd LLL')}</Text>
				</View>
			</View>
			<View style={{ height: '70vh' }}>
				<ScrollView>
					{data!.map((habit) => (
						<View style={styles.habitRow} key={habit.id}>
							<HabitField habit={habit.name} />
							<Pressable
								style={[styles.habitCheck, habit.checked ? styles.checkedHabit : styles.uncheckedHabit]}
								onPress={() =>
									navigation.navigate('Modal', {
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
										{/* eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */}
										<Text>{DateTime?.fromISO(habit.created_at).toFormat('hh:mm')}</Text>
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
		height: 'calc(10vh + 10px)',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100px',
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
		justifyContent: 'center',
		alignItems: 'center',
		height: '10vh',
		width: '50vw',
	},
	textInput: {
		flex: 0,
		color: 'white',
		backgroundColor: '#333',
		width: '300px',
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
		margin: '5px',
	},
	uncheckedHabit: {
		backgroundColor: '#689399',
	},
});
