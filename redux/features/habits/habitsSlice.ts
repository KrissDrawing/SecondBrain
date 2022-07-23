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
		getHabits: builder.query<HabitType[], number>({
			queryFn: async (dayShift) => {
				const date = dateFromNow(dayShift);
				try {
					const habitsTracking = await firestore()
						.collection('users/bt9NWyPenn6L6w2vQUzS/habitsTracking')
						.doc(date)
						.get();
					if (habitsTracking.data()?.data) {
						// TODO: add date of current displayed day
						return { data: habitsTracking.data()!.data as HabitType[] };
					} else {
						const habitsList = await firestore().collection('users/bt9NWyPenn6L6w2vQUzS/habitsList').doc('data').get();
						if (habitsList.data()?.data) {
							await firestore()
								.collection('users/bt9NWyPenn6L6w2vQUzS/habitsTracking')
								.doc(date)
								// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
								.set({ date, data: habitsList.data()!.data });
							return { data: habitsList.data()!.data as HabitType[] };
						} else {
							const habits: HabitType[] = [];
							const querySnapshot = await firestore().collection('users/bt9NWyPenn6L6w2vQUzS/habits').get();
							querySnapshot.forEach((docTmp) => {
								habits.push({ ...docTmp.data() } as HabitType);
							});
							return { data: habits };
						}
					}
				} catch (e) {
					return { error: { message: 'cant get habits' } };
				}
			},
		}),
		addHabit: builder.mutation<HabitType, CreateHabitFormType>({
			queryFn: async (habit) => {
				try {
					const newDocRef = firestore().collection('users/bt9NWyPenn6L6w2vQUzS/habits').doc();
					const newHabit = {
						...habit,
						checked: false,
						created_at: formatISO(new Date()),
						started_at: habit.started_at ? formatISO(habit.started_at) : null,
						duration: habit.duration ? durationFromPicker(new Date(habit.duration)) : null,
						id: newDocRef.id,
					};
					const habitsListRef = firestore().collection('users/bt9NWyPenn6L6w2vQUzS/habitsList').doc('data');
					await habitsListRef.set(
						{
							data: firestore.FieldValue.arrayUnion(newHabit),
						},
						{ merge: true }
					);
					const habitsTrackingRef = firestore()
						.collection('users/bt9NWyPenn6L6w2vQUzS/habitsTracking')
						.doc(dateFromNow());
					await habitsTrackingRef.set(
						{
							data: firestore.FieldValue.arrayUnion(newHabit),
						},
						{ merge: true }
					);
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
						habitsApi.util.updateQueryData('getHabits', 0, (draft) => {
							draft.push(updatedHabit);
						})
					);
				} catch {
					console.error('couldnt update habits after adding one');
				}
			},
		}),
		checkHabit: builder.mutation<null, { habit: HabitType; dayShift: number }>({
			queryFn: async ({ habit, dayShift }) => {
				try {
					const habitsListRef = firestore()
						.collection('users/bt9NWyPenn6L6w2vQUzS/habitsTracking')
						.doc(dateFromNow(dayShift));
					await habitsListRef.update({
						data: firestore.FieldValue.arrayRemove(habit),
					});
					await habitsListRef.update({
						data: firestore.FieldValue.arrayUnion({ ...habit, checked: true }),
					});
					return { data: null };
				} catch (e) {
					return { error: { message: `can't update current habit` } };
				}
			},
			async onQueryStarted({ habit: { id } }, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(
						habitsApi.util.updateQueryData('getHabits', 0, (draft) => {
							const updatedItemIndex = draft.findIndex((item) => item.id === id);
							draft[updatedItemIndex] = { ...draft[updatedItemIndex], checked: true };
						})
					);
				} catch {
					console.error(`can't update habit ${id} after check`);
				}
			},
		}),
		deleteHabit: builder.mutation<null, HabitType>({
			queryFn: async (habit) => {
				try {
					const habitsListRef = firestore().collection('users/bt9NWyPenn6L6w2vQUzS/habitsList').doc('data');

					if (habit) {
						await firestore().doc(`users/bt9NWyPenn6L6w2vQUzS/habits/${habit.id}`).delete();
						await habitsListRef.update({
							data: firestore.FieldValue.arrayRemove(habit),
						});
					}
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
