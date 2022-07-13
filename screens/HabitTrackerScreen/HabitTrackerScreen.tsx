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
} from 'react-native';
import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HabitField } from '../../components/HabitField';
// eslint-disable-next-line import/extensions
import { RootStackParams } from '../../App';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { add, check } from '../../redux/features/habits';

export function HabitTrackerScreen(props: NativeStackScreenProps<RootStackParams, 'HabitsTracker'>) {
	const { navigation } = props;
	const habits = useAppSelector((state) => state.habits.habitsList);
	const dispatch = useAppDispatch();
	const [habitName, setHabitName] = useState('');

	const handleHabitChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
		setHabitName(e.nativeEvent.text);
	};

	return (
		<View>
			<View style={styles.addHabit}>
				<TextInput value={habitName} style={styles.textInput} onChange={handleHabitChange} />
				<Button title="Add" onPress={() => dispatch(add({ id: habits.length, name: habitName, checked: false }))} />
			</View>
			<ScrollView style={styles.root} horizontal>
				{habits.map((habit, index) => (
					<View key={habit.id} style={[habit.checked ? styles.checkedHabit : styles.uncheckedHabit]}>
						<HabitField habit={habit.name} />
						<Pressable
							onPress={() =>
								navigation.navigate('Modal', {
									onHabitCheckPress: () => dispatch(check((index))),
								})
							}>
							<Text>Im pressable!</Text>
						</Pressable>
					</View>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
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
