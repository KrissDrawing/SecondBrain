import { TextInputProps } from 'react-native';

export interface StyledTextInputProps extends TextInputProps {
	title?: string;
	error?: string;
}
