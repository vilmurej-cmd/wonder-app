import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import IslandScreen from '../screens/IslandScreen';
import StorySparkScreen from '../screens/StorySparkScreen';
import TinyChefScreen from '../screens/TinyChefScreen';
import QuestScreen from '../screens/QuestScreen';
import FeelingsScreen from '../screens/FeelingsScreen';
import ABCWorldScreen from '../screens/ABCWorldScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F3E8FF' },
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="Island" component={IslandScreen} />
      <Stack.Screen name="StorySpark" component={StorySparkScreen} />
      <Stack.Screen name="TinyChef" component={TinyChefScreen} />
      <Stack.Screen name="Quest" component={QuestScreen} />
      <Stack.Screen name="Feelings" component={FeelingsScreen} />
      <Stack.Screen name="ABCWorld" component={ABCWorldScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
