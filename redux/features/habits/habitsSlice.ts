import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { HabitsState, HabitType } from './habitsSlice.types';

const initialState: HabitsState = {
	habitsList: [
		{
			id: 1,
			name: 'gabit1',
			checked: false,
		},
		{
			id: 2,
			name: 'habit2',
			checked: false,
		},
		{
			id: 3,
			name: 'habit3',
			checked: false,
		},
	],
};

export const habitsSlice = createSlice({
	name: 'habits',
	initialState,
	reducers: {
		add: (state, action: PayloadAction<HabitType>) => {
			state.habitsList.push(action.payload);
		},
		check: (state, action: PayloadAction<number>) => {
			state.habitsList[action.payload] = {
				...state.habitsList[action.payload],
				checked: true,
			};
		},
	},
});

// Action creators are generated for each case reducer function
export const { add, check } = habitsSlice.actions;

export default habitsSlice.reducer;
