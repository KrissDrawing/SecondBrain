import { StyleSheet, TextInput, View} from 'react-native';
import { StyledTextInputProps } from './StyledTextInput.types';

export function StyledTextInput(props:StyledTextInputProps) {
	const { title, error, ...rest } = props;
	return (
		<View>
			<TextInput placeholder='title' {...rest} style={styles.root} />
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		borderWidth: 2,
		borderColor: '#00ffe1',
		borderRadius: 8,
		fontSize: 24,
		padding: 10,
		color: 'white',
		width: '300px',
	},
	title: {
		color: '#ccc',
	}
});
