import { Button, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAddHabitMutation } from '../../redux/features/habits';
import { CreateHabitFormType, HabitCreateFormProps } from './HabitCreateForm.types';
import { StyledTextInput } from '../../components/StyledTextInput';
import { formatTime } from '../../utils/formatDate';

export function HabitCreateForm({ goBack }: HabitCreateFormProps) {
	const { control, handleSubmit, setValue, getValues } = useForm<CreateHabitFormType>({
		defaultValues: {
			name: '',
			started_at: undefined,
			duration: undefined,
		},
	});
	const [addHabit, { isLoading: addHabitLoading }] = useAddHabitMutation();
	const [showStartTimePicker, setShowStartTimePicker] = useState(false);
	const [showDurationPicker, setShowDurationPicker] = useState(false);

	const onChangeTimePicker = (event: DateTimePickerEvent, date?: Date | undefined) => {
		if (event.type === 'set' && date) setValue('started_at', date);
		setShowStartTimePicker(false);
	};

	const onChangeDurationPicker = (event: DateTimePickerEvent, date?: Date | undefined) => {
		if (event.type === 'set' && date) setValue('duration', date);
		setShowDurationPicker(false);
	};

	const handleAddHabit = (form: CreateHabitFormType) => {
		void addHabit(form);
		goBack();
		// TODO: handle errors
	};

	return (
		<View style={styles.root}>
			<Controller
				control={control}
				name="name"
				render={({ field: { onChange, value } }) => (
					<StyledTextInput title="name" value={value} onChangeText={onChange} />
				)}
			/>

			{showStartTimePicker && (
				<Controller
					control={control}
					name="started_at"
					defaultValue={new Date()}
					render={({ field: { value } }) => (
						<DateTimePicker value={value} mode="time" is24Hour onChange={onChangeTimePicker} />
					)}
				/>
			)}
			{showDurationPicker && (
				<Controller
					control={control}
					name="duration"
					defaultValue={new Date()}
					render={({ field: { value } }) => (
						<DateTimePicker value={value} display="spinner" mode="time" is24Hour onChange={onChangeDurationPicker} />
					)}
				/>
			)}
			<Button
				title={getValues('started_at') ? `start at: ${formatTime(getValues('started_at'))}` : 'Start time'}
				onPress={() => {
					setShowStartTimePicker(true);
				}}
			/>
			<Button
				title={getValues('duration') ? `duration: ${formatTime(getValues('duration'))}` : 'Duration'}
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
	root: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
	},
});
