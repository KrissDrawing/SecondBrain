import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { collection, query, getDocs, setDoc, doc } from 'firebase/firestore';
import { HabitsState, HabitType } from './habitsSlice.types';
import { db } from '../../../core/firebase';
import { CustomApiError } from '../types';

const initialState: HabitsState = {
	habitsList: [],
};

export const habitsSlice = createSlice({
	name: 'habits',
	initialState,
	reducers: {
		set: (state, action: PayloadAction<HabitType[]>) => {
			state.habitsList = action.payload;
		},
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

export const habitsApi = createApi({
	reducerPath: 'habitsApi',
	baseQuery: fakeBaseQuery<CustomApiError>(),
	endpoints: (builder) => ({
		getHabits: builder.query<HabitType[], void>({
			queryFn: async () => {
				try {
					const habits: HabitType[] = [];
					const q = query(collection(db, 'users', 'bt9NWyPenn6L6w2vQUzS', 'habits'));

					const querySnapshot = await getDocs(q);
					querySnapshot.forEach((docTmp) => {
						habits.push({ ...docTmp.data(), id: docTmp.id } as HabitType);
					});
					return { data: habits };
				} catch (e) {
					return { error: { message: 'cant get habits' } };
				}
			},
		}),
		addHabit: builder.mutation<HabitType, Omit<HabitType, 'id' | 'created_at'>>({
			queryFn: async (habit) => {
				try {
					const newDocRef = doc(collection(db, 'users', 'bt9NWyPenn6L6w2vQUzS', 'habits'));
					const newHabit = { ...habit, created_at: new Date().toUTCString(), id: newDocRef.id };
					await setDoc(newDocRef, newHabit);
					add(newHabit);
					return { data: newHabit };
				} catch (e) {
					return { error: { message: 'cant add habits' } };
				}
			},
			async onQueryStarted(data, { dispatch, queryFulfilled }) {
				try {
					const { data: updatedHabit } = await queryFulfilled;
					dispatch(
						habitsApi.util.updateQueryData('getHabits', undefined, (draft) => {
							draft.push(updatedHabit);
						})
					)
				} catch {
					console.error('couldnt update habits after adding one');
				}
			},
		}),
	}),
});

export const { useGetHabitsQuery, useAddHabitMutation } = habitsApi;

export const { add, check, set } = habitsSlice.actions;

export default habitsSlice.reducer;
