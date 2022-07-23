import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HabitType } from '../../redux/features/habits';
import { RootStackParams } from '../../App';

export interface HabitFieldProps {
	habit: HabitType;
	dayShift: number;
	navigation: NativeStackNavigationProp<RootStackParams, 'HabitsTracker', undefined>;
}
