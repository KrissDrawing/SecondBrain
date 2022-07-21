import { StyleSheet, Text, View } from 'react-native';
import { HabitFieldProps } from './HabitField.types';

export function HabitField(props: HabitFieldProps) {
	const { habit } = props;
	return (
		<View>
			<Text style={styles.root}>{habit}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		display: 'flex',
		flex:1,
		height: 100,
		color: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#abc',
	},
});
