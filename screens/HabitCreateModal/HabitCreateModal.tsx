import { StyleSheet, View } from 'react-native';
import { HabitCreateModalProps } from './HabitCreateModal.types';
import { HabitCreateForm } from '../HabitCreateForm';

export function HabitCreateModal({ navigation }: HabitCreateModalProps) {
	return (
		<View style={styles.container}>
			<HabitCreateForm goBack={() => navigation.goBack()} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	textInput: {
		color: 'white',
		backgroundColor: '#333',
		width: '300px',
	},
});
