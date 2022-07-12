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
import { HabitType } from './HabitTrackerScreen.types';
import { HabitField } from '../../components/HabitField';
// eslint-disable-next-line import/extensions
import { RootStackParams } from '../../App';



export function HabitTrackerScreen(props: NativeStackScreenProps<RootStackParams, 'TabOne'>) {
	const { navigation } = props;
	const [habitName, setHabitName] = useState('');
	const [habits, setHabits] = useState<HabitType[]>([]);

	const handleHabitChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
		setHabitName(e.nativeEvent.text);
	};

	const onAddHabit = () => {
		setHabits((prevState) => [...prevState, { id: habits.length, name: habitName, checked: false }]);
	};

	const onHabitCheckPress = (index: number) => {
		const newHabits = habits;
		newHabits[index] = {
			...newHabits[index],
			checked: true,
		};
		setHabits([...newHabits]);
	};

	return (
		<View>
			<View style={styles.addHabit}>
				<TextInput value={habitName} style={styles.textInput} onChange={handleHabitChange} />
				<Button title="Add" onPress={onAddHabit} />
			</View>
			<ScrollView style={styles.root} horizontal>
				{habits.map((habit, index) => (
					<View key={habit.id} style={[habit.checked ? styles.checkedHabit : styles.uncheckedHabit]}>
						<HabitField habit={habit.name} />
						<Pressable onPress={() => navigation.navigate('Modal', {
							onHabitCheckPress: () => onHabitCheckPress(index),
						})}>
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
