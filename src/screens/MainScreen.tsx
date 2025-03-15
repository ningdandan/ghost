/**
 * MainScreen.tsx
 * 
 * This is the main screen of the habit tracking application.
 * It serves as the primary interface for users to:
 * - View their habits
 * - Track daily progress
 * - Add new habits
 * - Log entries for existing habits
 */

// Core React and React Native imports for UI components and hooks
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

// Navigation types and hooks from React Navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types';

// Component imports using index.ts for cleaner imports
import {
  Calendar,      // Calendar component for date selection
  HabitList,     // List component to display habits
  LogInputModal, // Modal for adding log entries
  AddHabitModal, // Modal for creating new habits
} from '../components';

// Date manipulation utilities from date-fns library
import { addMonths, subMonths } from 'date-fns';

// Animation utilities for smooth UI transitions
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

// Custom hook for centralized habit data management
import { useHabits } from '../hooks/useHabits';

type MainScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

const { width } = Dimensions.get('window');

/**
 * MainScreen Component
 * 
 * This is the primary screen of the application that displays:
 * 1. A calendar for date selection
 * 2. A list of habits
 * 3. Controls for adding new habits and logs
 * 
 * The screen manages several pieces of state:
 * - Current selected date
 * - Modal visibility states
 * - Selected habit for logging
 */
const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  // State Management
  // ---------------
  
  // Date state - initialized to March 2025 for development
  const [currentDate, setCurrentDate] = useState(new Date('2025-03-15'));
  
  // Modal visibility states
  const [showLogInput, setShowLogInput] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  
  // Habit selection states
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [currentHabitId, setCurrentHabitId] = useState<string | undefined>(undefined);
  
  // Get habits data and operations from our custom hook
  const { habits, loading, addLog, refreshHabits } = useHabits();

  // Screen Focus Effect
  // ------------------
  // Refresh habits data whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshHabits();
    }, [refreshHabits])
  );

  // Event Handlers
  // -------------
  
  // Handle month changes in the calendar
  const handleMonthChange = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
  }, []);

  // Initialize the log creation process for a habit
  const handleAddLog = useCallback((habitId: string) => {
    setSelectedHabitId(habitId);
    setShowLogInput(true);
  }, []);

  // Handle the submission of a new log entry
  const handleLogSubmit = useCallback(async (text: string, date: Date) => {
    if (selectedHabitId) {
      await addLog(selectedHabitId, text, date);
      setShowLogInput(false);
      setSelectedHabitId(null);
    }
  }, [selectedHabitId, addLog]);

  // Modal control handlers
  const handleAddHabit = useCallback(() => {
    setShowAddHabit(true);
  }, []);

  const handleCloseAddHabit = useCallback(() => {
    setShowAddHabit(false);
  }, []);

  // Loading State
  // ------------
  // Show loading indicator while habits are being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Main Render
  // ----------
  return (
    <View style={styles.container}>
      {/* Calendar Section */}
      <View style={styles.calendarContainer}>
        <Calendar date={currentDate} onMonthChange={handleMonthChange} />
      </View>

      {/* Habits List Section */}
      <View style={styles.habitListContainer}>
        <HabitList
          habits={habits}
          selectedDate={currentDate}
          onAddLog={handleAddLog}
          onAddHabit={handleAddHabit}
          currentHabitId={currentHabitId}
          onHabitChange={setCurrentHabitId}
        />
      </View>

      {/* Floating Action Button - Only shown when a habit is selected */}
      {currentHabitId && (
        <TouchableOpacity
          style={styles.addLogButton}
          onPress={() => handleAddLog(currentHabitId)}
        >
          <Text style={styles.addLogButtonText}>+</Text>
        </TouchableOpacity>
      )}

      {/* Modals */}
      <LogInputModal
        visible={showLogInput}
        onSubmit={handleLogSubmit}
        onClose={() => {
          setShowLogInput(false);
          setSelectedHabitId(null);
        }}
      />

      <AddHabitModal
        visible={showAddHabit}
        onClose={handleCloseAddHabit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    height: 80,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  habitListContainer: {
    flex: 1,
  },
  addLogButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  addLogButtonText: {
    color: '#fff',
    fontSize: 32,
    marginTop: -2,
  },
});

export default MainScreen; 