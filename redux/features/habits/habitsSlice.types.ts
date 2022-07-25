export interface HabitsState {
	habitsList: HabitType[];
}

export interface HabitType {
	name: string;
	id: string;
	checked: boolean;
	created_at: string;
	started_at: string | null;
}

export interface HabitStatsType {
	streak: number;
	longestStreak: number;
}
