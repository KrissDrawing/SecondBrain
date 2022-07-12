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
		width: '200px',
		height: '10vh',
		color: 'white',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#abc'
	},
});
