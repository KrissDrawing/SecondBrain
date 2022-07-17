import { Button, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useAddHabitMutation } from '../../redux/features/habits';
import {
	CreateHabitFormType,
	HabitCreateFormProps,
} from './HabitCreateForm.types';
import { StyledTextInput } from '../../components/StyledTextInput';

export function HabitCreateForm({ goBack }: HabitCreateFormProps) {
	const {
		control,
		handleSubmit,
	} = useForm<CreateHabitFormType>({
		defaultValues: {
			name: '',
		},
	});
	const [addHabit, { isLoading: addHabitLoading }] = useAddHabitMutation();

	const handleAddHabit = (form: CreateHabitFormType) => {
		void addHabit({ name: form.name, checked: false });
		// TODO: handle errors
	};

	return (
		<View style={styles.container}>
			<Controller
				control={control}
				name="name"
				render={({ field: { onChange, value } }) => (
					<StyledTextInput title='name' value={value} onChange={onChange} />
				)}
			/>
			<Button
				title="Add"
				disabled={addHabitLoading}
				onPress={() => {
					handleSubmit(handleAddHabit);
					goBack();
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
});
