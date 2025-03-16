/**
 * EditHabitScreen - A screen component for editing existing habits
 * This screen receives a habitId parameter through navigation and displays
 * a basic interface for editing a habit's details.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

/**
 * Props type definition for the EditHabitScreen component
 * Includes navigation prop for screen navigation and route prop for accessing parameters
 */
type EditHabitScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditHabit'>;
  route: RouteProp<RootStackParamList, 'EditHabit'>;
};

/**
 * EditHabitScreen Component
 * Currently displays a basic view with the habit ID
 * TODO: Implement full editing functionality
 */
const EditHabitScreen: React.FC<EditHabitScreenProps> = ({ navigation, route }) => {
  const { habitId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Habit</Text>
      <Text style={styles.subtitle}>Habit ID: {habitId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default EditHabitScreen; 