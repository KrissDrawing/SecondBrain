import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import firestore from '@react-native-firebase/firestore';
import { formatISO } from 'date-fns';
import { HabitType } from './habitsSlice.types';
import { CustomApiError } from '../types';
import { CreateHabitFormType } from '../../../screens/HabitCreateForm/HabitCreateForm.types';
import { dateFromNow, durationFromPicker } from '../../../utils/formatDate';

export const habitsApi = createApi({
	reducerPath: 'habitsApi',
	baseQuery: fakeBaseQuery<CustomApiError>(),
	endpoints: (builder) => ({
		getHabits: builder.query<{ date: string; habits: HabitType[] }, number>({
			queryFn: async (dayShift) => {
				const date = dateFromNow(dayShift);
				try {
					const habitsTracking = await firestore()
						.collection('users/bt9NWyPenn6L6w2vQUzS/habitsTracking')
						.doc(date)
						.get();
					if (habitsTracking.data()?.data) {
						return {
							data: {
								date: habitsTracking.data()!.date as string,
								habits: habitsTracking.data()!.data as HabitType[],
							},
						};
					} else {
						const habitsList = await firestore().collection('users/bt9NWyPenn6L6w2vQUzS/habitsList').doc('data').get();
						if (dayShift === 0) {
							if (habitsList.data()?.data) {
								await firestore()
									.collection('users/bt9NWyPenn6L6w2vQUzS/habitsTracking')
									.doc(date)
									// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
									.set({ date, data: habitsList.data()!.data });
								return {
									data: {
										date,
										habits: habitsList.data()!.data as HabitType[],
									},
								};
							}
						}
					}
					return {
						data: {
							date,
							habits: [] as HabitType[],
						},
					};
				} catch (e) {
					return { error: { message: 'cant get habits' } };
				}
			},
		}),
		addHabit: builder.mutation<HabitType, CreateHabitFormType>({
			queryFn: async (habit) => {
				const batch = firestore().batch();
				const newDocRef = firestore().collection('users/bt9NWyPenn6L6w2vQUzS/habits').doc();
				const habitsListRef = firestore().collection('users/bt9NWyPenn6L6w2vQUzS/habitsList').doc('data');
				const habitsTrackingRef = firestore()
					.collection('users/bt9NWyPenn6L6w2vQUzS/habitsTracking')
					.doc(dateFromNow());
				const newHabit = {
					...habit,
					checked: false,
					created_at: formatISO(new Date()),
					started_at: habit.started_at ? formatISO(habit.started_at) : null,
					duration: habit.duration ? durationFromPicker(new Date(habit.duration)) : null,
					id: newDocRef.id,
				};
				batch.set(
					habitsListRef,
					{
						data: firestore.FieldValue.arrayUnion(newHabit),
					},
					{ merge: true }
				);
				batch.set(
					habitsTrackingRef,
					{
						data: firestore.FieldValue.arrayUnion(newHabit),
					},
					{ merge: true }
				);
				batch.set(newDocRef, newHabit);
				try {
					await batch.commit();
					return { data: newHabit };
				} catch (e) {
					return { error: { message: 'cant add habits' } };
				}
			},
			async onQueryStarted(data, { dispatch, queryFulfilled }) {
				try {
					const { data: updatedHabit } = await queryFulfilled;
					dispatch(
						habitsApi.util.updateQueryData('getHabits', 0, (draft) => {
							draft.habits.push(updatedHabit);
						})
					);
				} catch {
					console.error('couldnt update habits after adding one');
				}
			},
		}),
		checkHabit: builder.mutation<null, { habit: HabitType; dayShift: number }>({
			queryFn: async ({ habit, dayShift }) => {
				const batch = firestore().batch();
				const habitsListRef = firestore()
					.collection('users/bt9NWyPenn6L6w2vQUzS/habitsTracking')
					.doc(dateFromNow(dayShift));
				batch.update(habitsListRef, {
					data: firestore.FieldValue.arrayRemove(habit),
				});
				batch.update(habitsListRef, {
					data: firestore.FieldValue.arrayUnion({ ...habit, checked: true }),
				});
				try {
					await batch.commit();
					return { data: null };
				} catch (e) {
					return { error: { message: `can't update current habit` } };
				}
			},
			async onQueryStarted({ habit: { id }, dayShift }, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(
						habitsApi.util.updateQueryData('getHabits', dayShift, (draft) => {
							const updatedItemIndex = draft.habits.findIndex((item) => item.id === id);
							draft.habits[updatedItemIndex] = { ...draft.habits[updatedItemIndex], checked: true };
						})
					);
				} catch {
					console.error(`can't update habit ${id} after check`);
				}
			},
		}),
		deleteHabit: builder.mutation<null, HabitType>({
			queryFn: async (habit) => {
				const batch = firestore().batch();
				const habitsRef = firestore().doc(`users/bt9NWyPenn6L6w2vQUzS/habits/${habit.id}`);
				const habitsListRef = firestore().collection('users/bt9NWyPenn6L6w2vQUzS/habitsList').doc('data');
				const habitsTrackingRef = firestore()
					.collection('users/bt9NWyPenn6L6w2vQUzS/habitsTracking')
					.doc(dateFromNow());

				if (habit) {
					batch.delete(habitsRef);
					batch.update(habitsListRef, {
						data: firestore.FieldValue.arrayRemove({ ...habit, checked: false }),
					});
					batch.update(habitsTrackingRef, {
						data: firestore.FieldValue.arrayRemove(habit),
					});
				}
				try {
					await batch.commit();
					return { data: null };
				} catch (e) {
					return { error: { message: `can't delete current habit` } };
				}
			},
			async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(
						habitsApi.util.updateQueryData('getHabits', 0, (draft) => {
							const updatedItemIndex = draft.habits.findIndex((item) => item.id === id);
							draft.habits.splice(updatedItemIndex, 1);
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
