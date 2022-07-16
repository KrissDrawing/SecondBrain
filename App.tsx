import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Provider } from 'react-redux';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { store } from './redux/app/store';

export type RootStackParams = {
	Modal: {
		habitId: string;
	};
	HabitsTracker: undefined;
};

export default function App() {
	const isLoadingComplete = useCachedResources();
	const colorScheme = useColorScheme();

	if (!isLoadingComplete) {
		return null;
	}
	return (
		<Provider store={store}>
			<SafeAreaProvider>
				<Navigation colorScheme={colorScheme} />
				<StatusBar />
			</SafeAreaProvider>
		</Provider>
	);
}
