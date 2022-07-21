import { Button, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
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
	const [showDurationPicker, setShowDurationPicker] = useState(false);

	const onChangeDuration = (event: any, selectedDate: any) => {
		console.log(selectedDate);
		setShowDurationPicker(false);
	};

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
					<StyledTextInput title='name' value={value} onChangeText={onChange} />
				)}
			 />
			 {showDurationPicker && (
				<DateTimePicker
					testID="dateTimePicker"
					value={new Date(1598051730000)}
					mode='time'
					is24Hour
					onChange={onChangeDuration}
				/>
			 )}
			 <Button
				title="Duration"
				onPress={() => {
					setShowDurationPicker(true);
				}}
			 />
			<Button
				title="Add"
				disabled={addHabitLoading}
				onPress={() => {
					// handleSubmit(handleAddHabit);
					void addHabit({ name: 'form.name', checked: false })
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
