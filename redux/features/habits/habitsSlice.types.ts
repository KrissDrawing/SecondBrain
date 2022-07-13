export interface HabitsState {
	habitsList: HabitType[]
}

export interface HabitType {
	name: string,
	id: number,
	checked: boolean,
}
