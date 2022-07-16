import { configureStore } from '@reduxjs/toolkit'
import { habitsReducer, habitsApi } from '../features/habits'

export const store = configureStore({
	reducer: {
		habits: habitsReducer,
		[habitsApi.reducerPath]: habitsApi.reducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(habitsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
