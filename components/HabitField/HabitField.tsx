import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { HabitFieldProps } from './HabitField.types';

export function HabitField(props: HabitFieldProps) {
	const { habit, dayShift, navigation, shouldCheckDay } = props;
	return (
		<View style={styles.root}>
			<View style={styles.habitNameRoot}>
				<View>
					<Text>{habit.name}</Text>
				</View>
			</View>
			<Pressable
				style={[styles.habitCheck, habit.checked ? styles.checkedHabit : styles.uncheckedHabit]}
				onPress={() =>
					navigation.navigate('HabitCheckModal', {
						habit,
						dayShift,
						shouldCheckDay,
					})
				}>
				{habit.checked ? (
					<FontAwesome style={styles.checkedIcon} name="check-square" size={50} color="black" />
				) : (
					<View style={styles.iconWrapper}>
						<MaterialCommunityIcons
							style={styles.checkedIcon}
							name="clipboard-text-clock-outline"
							size={50}
							color="black"
						/>
						<Text>{habit.started_at && format(new Date(habit.started_at), 'HH:mm')}</Text>
					</View>
				)}
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	habitNameRoot: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#abc',
	},
	root: {
		flexDirection: 'row',
	},
	habitCheck: {
		display: 'flex',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 100,
	},
	checkedHabit: {
		backgroundColor: '#84fa92',
		color: 'red',
	},
	iconWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	checkedIcon: {
		opacity: 0.7,
		margin: 5,
	},
	uncheckedHabit: {
		backgroundColor: '#689399',
	},
});
