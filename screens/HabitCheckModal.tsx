import { Button, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// eslint-disable-next-line import/extensions
import { RootStackParams } from '../App';

type Props = NativeStackScreenProps<RootStackParams, 'Modal'>

export default function HabitCheckModal({ route, navigation }: Props) {
	const { onHabitCheckPress } = route.params;
	return (
		<View style={styles.container}>
			<Button title="accept" onPress={() => {
				onHabitCheckPress();
				navigation.goBack();
			}} />
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
