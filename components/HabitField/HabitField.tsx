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
		flex: 1,
		width: '50vw',
		height: '10vh',
		color: 'white',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#abc',
	},
});
