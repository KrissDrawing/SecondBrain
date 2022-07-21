import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import firestore from '@react-native-firebase/firestore';
import { formatISO } from 'date-fns';
import { HabitType } from './habitsSlice.types';
import { CustomApiError } from '../types';

export const habitsApi = createApi({
	reducerPath: 'habitsApi',
	baseQuery: fakeBaseQuery<CustomApiError>(),
	endpoints: (builder) => ({
		getHabits: builder.query<HabitType[], void>({
			queryFn: async () => {
				try {
					const habits: HabitType[] = [];
					// const q = query(collection(db, 'users', 'bt9NWyPenn6L6w2vQUzS', 'habits'));
					const querySnapshot = await firestore().collection('users/bt9NWyPenn6L6w2vQUzS/habits').get();
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
					const newDocRef = firestore().collection('users/bt9NWyPenn6L6w2vQUzS/habits').doc();
					const newHabit = { ...habit, created_at: formatISO(new Date()), id: newDocRef.id };
					await newDocRef.set(newHabit);
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
					);
				} catch {
					console.error('couldnt update habits after adding one');
				}
			},
		}),
		checkHabit: builder.mutation<null, string>({
			queryFn: async (habitId) => {
				try {
					await firestore().doc(`users/bt9NWyPenn6L6w2vQUzS/habits/${habitId}`).update({
						checked: true,
					});
					return { data: null };
				} catch (e) {
					return { error: { message: `can't update current habit` } };
				}
			},
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(
						habitsApi.util.updateQueryData('getHabits', undefined, (draft) => {
							const updatedItemIndex = draft.findIndex((item) => item.id === id);
							draft[updatedItemIndex] = { ...draft[updatedItemIndex], checked: true };
						})
					);
				} catch {
					console.error(`can't update habit ${id} after check`);
				}
			},
		}),
		deleteHabit: builder.mutation<null, string>({
			queryFn: async (habitId) => {
				try {
					await firestore().doc(`users/bt9NWyPenn6L6w2vQUzS/habits/${habitId}`).delete();
					return { data: null };
				} catch (e) {
					return { error: { message: `can't delete current habit` } };
				}
			},
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(
						habitsApi.util.updateQueryData('getHabits', undefined, (draft) => {
							const updatedItemIndex = draft.findIndex((item) => item.id === id);
							draft.splice(updatedItemIndex, 1);
						})
					);
				} catch {
					console.error(`can't update habit ${id} after delete`);
				}
			},
		}),
	}),
});

export const { useGetHabitsQuery, useAddHabitMutation, useCheckHabitMutation, useDeleteHabitMutation } = habitsApi;
