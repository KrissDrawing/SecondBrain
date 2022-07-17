/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Button,
  ColorSchemeName,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput, TextInputChangeEventData,
  View,
} from 'react-native';

import { useState } from 'react';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import HabitCheckModal from '../screens/HabitCheckModal';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { HabitTrackerScreen } from '../screens/HabitTrackerScreen';
import { useAddHabitMutation } from '../redux/features/habits';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={HabitCheckModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const [habitName, setHabitName] = useState('');
  const [addHabit, { isLoading: addHabitLoading }] = useAddHabitMutation();

  const handleHabitChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setHabitName(e.nativeEvent.text);
  };

  const handleAddHabit = () => {
    void addHabit({ name: habitName, checked: false });
    // TODO: handle errors
  };

  return (
    <BottomTab.Navigator
      initialRouteName="HabitsTracker"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="HabitsTracker"
        component={HabitTrackerScreen}
        options={({ navigation }: RootTabScreenProps<'HabitsTracker'>) => ({
          title: 'Habits Tracker',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <View style={styles.addHabit}>
              <TextInput value={habitName} style={styles.textInput} onChange={handleHabitChange} />
              <Button title="Add" disabled={addHabitLoading} onPress={handleAddHabit} />
            </View>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

const styles = StyleSheet.create({
  addHabit: {
    flexDirection: 'row',
  },
  textInput: {
    // flex: 0,
    color: 'white',
    backgroundColor: '#333',
    width: '300px',
  },
});
