import { Text, View } from 'react-native';
import { HabitFieldProps } from './HabitField.types';

export function HabitField(props: HabitFieldProps) {
	const { habit } = props;
	return (
		<View>
			<Text>{habit}</Text>
		</View>
	);
}
