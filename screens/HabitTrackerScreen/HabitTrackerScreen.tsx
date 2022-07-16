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
import { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HabitField } from '../../components/HabitField';
import { RootStackParams } from '../../App';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { add, check, set, useAddHabitMutation, useGetHabitsQuery } from '../../redux/features/habits';

export function HabitTrackerScreen(props: NativeStackScreenProps<RootStackParams, 'HabitsTracker'>) {
	const { navigation } = props;
	const habits = useAppSelector((state) => state.habits.habitsList);
	const dispatch = useAppDispatch();
	const [habitName, setHabitName] = useState('');

	const { data, error, isLoading } = useGetHabitsQuery();
	const [addHabit] = useAddHabitMutation();

	useEffect(() => {
		if (data) {
			dispatch(set(data));
		}
	}, [data, dispatch]);

	const handleHabitChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
		setHabitName(e.nativeEvent.text);
	};

	const handleAddHabit = () => {
		addHabit({ name: habitName, checked: false })
			.unwrap()
			.then((res) => {
				dispatch(add(res));
			})
			.catch((e) => console.error(e));
	};

	return (
		<>
			{isLoading ? (
				<View style={styles.loaderRoot}>
					<ActivityIndicator size="large" />
				</View>
			) : (
				<View>
					<View style={styles.addHabit}>
						<>
							<TextInput value={habitName} style={styles.textInput} onChange={handleHabitChange} />
							<Button title="Add" onPress={handleAddHabit} />
						</>
					</View>
					<ScrollView style={styles.root} horizontal>
						{habits.map((habit, index) => (
							<View key={habit.id} style={[habit.checked ? styles.checkedHabit : styles.uncheckedHabit]}>
								<HabitField habit={habit.name} />
								<Pressable
									onPress={() =>
										navigation.navigate('Modal', {
											onHabitCheckPress: () => dispatch(check(index)),
										})
									}>
									<Text>Im pressable!</Text>
								</Pressable>
							</View>
						))}
					</ScrollView>
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
	loaderRoot: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	addHabit: {
		flexDirection: 'row',
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
		backgroundColor: '#0f0',
		color: 'red',
	},
	uncheckedHabit: {
		backgroundColor: '#fff',
	},
});
