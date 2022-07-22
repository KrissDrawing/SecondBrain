import { Button, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAddHabitMutation } from '../../redux/features/habits';
import { CreateHabitFormType, HabitCreateFormProps } from './HabitCreateForm.types';
import { StyledTextInput } from '../../components/StyledTextInput';

export function HabitCreateForm({ goBack }: HabitCreateFormProps) {
	const { control, handleSubmit, setValue } = useForm<CreateHabitFormType>({
		defaultValues: {
			name: '',
			started_at: new Date(),
		},
	});
	const [addHabit, { isLoading: addHabitLoading }] = useAddHabitMutation();
	const [showDurationPicker, setShowDurationPicker] = useState(false);

	const onChangeTimePicker = (event: DateTimePickerEvent, date?: Date | undefined) => {
		if (date) setValue('started_at', date);
		setShowDurationPicker(false);
	};

	const handleAddHabit = (form: CreateHabitFormType) => {
		void addHabit(form);
		goBack();
		// TODO: handle errors
	};

	return (
		<View style={styles.container}>
			<Controller
				control={control}
				name="name"
				render={({ field: { onChange, value } }) => (
					<StyledTextInput title="name" value={value} onChangeText={onChange} />
				)}
			/>

			{showDurationPicker && (
				<Controller
					control={control}
					name="started_at"
					defaultValue={new Date()}
					render={({ field: { value } }) => (
						<DateTimePicker value={value} mode="time" is24Hour onChange={onChangeTimePicker} />
					)}
				/>
			)}
			<Button
				title="Start time"
				onPress={() => {
					setShowDurationPicker(true);
				}}
			/>
			{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
			<Button title="Add" disabled={addHabitLoading} onPress={handleSubmit(handleAddHabit)} />
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
