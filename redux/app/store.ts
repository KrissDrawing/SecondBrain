import { configureStore } from '@reduxjs/toolkit'
import { habitsApi } from '../features/habits'

export const store = configureStore({
	reducer: {
		[habitsApi.reducerPath]: habitsApi.reducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(habitsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
