import { Button, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParams } from '../App';
import { useCheckHabitMutation, useDeleteHabitMutation } from '../redux/features/habits';

type Props = NativeStackScreenProps<RootStackParams, 'HabitCheckModal'>;

export default function HabitCheckModal({ route, navigation }: Props) {
	const { habit, dayShift = 0, shouldCheckDay = false } = route.params;
	const [checkHabit] = useCheckHabitMutation();
	const [deleteHabit] = useDeleteHabitMutation();

	return (
		<View style={styles.container}>
			<Button
				title="accept"
				onPress={() => {
					void checkHabit({ habit, dayShift, shouldCheckDay });
					navigation.goBack();
				}}
			/>
			<Button
				title="delete"
				onPress={() => {
					void deleteHabit(habit);
					navigation.goBack();
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
});
