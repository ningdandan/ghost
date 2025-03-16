import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Import screens
import MainScreen from '../screens/MainScreen';
import EditHabitScreen from '../screens/EditHabitScreen';

// Create a navigator that knows about our screen types (defined in RootStackParamList)
// This is like creating a map of our app's screens
const Stack = createNativeStackNavigator<RootStackParamList>();

// Main navigation component that sets up the structure of our app
export const Navigation = () => {
  return (
    // NavigationContainer is required at the root of our navigation tree
    // Think of it like the foundation of a building
    <NavigationContainer>
      {/* Stack.Navigator is like a stack of cards - only the top screen is visible */}
      <Stack.Navigator
        // Global options for all screens
        screenOptions={{
          headerShown: false,  // Hide the default navigation header
        }}
      >
        {/* Define each screen in our app */}
        {/* Like defining each page in a book */}
        
        {/* Main screen - this is our first/home screen */}
        <Stack.Screen 
          name="Main"           // Name we use to navigate to this screen
          component={MainScreen} // The actual component to render
        />

        {/* Edit habit screen - where we edit existing habits */}
        <Stack.Screen 
          name="EditHabit"           // Name we use to navigate to this screen
          component={EditHabitScreen} // The actual component to render
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 