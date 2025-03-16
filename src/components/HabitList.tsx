/**
 * HabitList Component
 * A swipeable carousel of habits that displays one habit at a time with pagination
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Habit } from '../types';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import AddHabitPage from './AddHabitPage';
import LogList from './LogList';

/**
 * Props interface for HabitList component
 * Defines what data and callbacks the component expects from its parent
 * This is a TypeScript type definition. It's ONLY used during development/compilation to check for errors. It gets completely removed when the code runs.
 */
interface HabitListProps {
  habits: Habit[];              // Array of habits to display
  selectedDate: Date;           // Currently selected date for showing logs
  onAddLog: (habitId: string) => void;  // Callback when user wants to add a log
  onAddHabit: () => void;      // Callback when user wants to add a new habit
  currentHabitId?: string;      // ID of currently selected habit
  onHabitChange?: (habitId: string) => void;  // Callback when selected habit changes
}

// Get screen width for swipe calculations
const { width } = Dimensions.get('window');

/**
 * HabitList Component Implementation
 */
const HabitList: React.FC<HabitListProps> = ({
  habits,
  selectedDate,
  onAddLog,
  onAddHabit,
  currentHabitId,
  onHabitChange,
}) => {
  // Local state to track which habit is currently displayed
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Animation value for swipe gesture (0 = centered, negative = swiped left, positive = swiped right)
  const translateX = useSharedValue(0);

  /**
   * Updates the currently displayed habit
   * Also notifies parent component about habit change via onHabitChange callback
   */
  const updateIndex = useCallback((newIndex: number) => {
    setCurrentIndex(newIndex);
    if (onHabitChange && habits[newIndex]) {
      onHabitChange(habits[newIndex].id);
    }
  }, [habits, onHabitChange]);

  /**
   * Handles the active swipe gesture
   * Updates translateX value as user swipes
   */
  const handleGestureEvent = useCallback((event: any) => {
    translateX.value = event.translationX;
  }, []);

  /**
   * Handles what happens when user finishes swipe gesture
   * If swipe was significant (>30% of screen), changes to next/previous habit
   * Otherwise, springs back to center
   */
  const handleGestureEnd = useCallback(() => {
    if (Math.abs(translateX.value) > width * 0.3) {
      const newIndex = translateX.value > 0 
        ? Math.max(0, currentIndex - 1)        // Swiped right = go to previous
        : Math.min(habits.length, currentIndex + 1);  // Swiped left = go to next
      updateIndex(newIndex);
    }
    // Animate back to center position
    translateX.value = withSpring(0);
  }, [currentIndex, habits.length, updateIndex]);

  /**
   * Effect to initialize first habit when component mounts
   * or when habits array changes
   */
  React.useEffect(() => {
    if (habits.length > 0 && onHabitChange && !currentHabitId) {
      onHabitChange(habits[0].id);
    }
  }, [habits, onHabitChange, currentHabitId]);

  // Style for swipe animation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  /**
   * If no habits exist, show the AddHabitPage
   */
  if (habits.length === 0) {
    return (
      <View style={styles.container}>
        <AddHabitPage onAddHabit={onAddHabit} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Pagination dots - one for each habit plus one for add habit page */}
      <View style={styles.pagination}>
        {[...habits, null].map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => updateIndex(index)}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          >
            <Text
              style={[
                styles.paginationText,
                index === currentIndex && styles.paginationTextActive,
              ]}
            >
              {index + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onEnded={handleGestureEnd}
        activeOffsetX={[-10, 10]}
      >
        <Animated.View style={[styles.habitContainer, animatedStyle]}>
          {currentIndex < habits.length ? (
            <View style={styles.habitContent}>
              <View style={styles.habitHeader}>
                <Text style={styles.habitAvatar}>{habits[currentIndex].avatar}</Text>
                <Text style={styles.habitName}>{habits[currentIndex].name}</Text>
              </View>
              <View style={styles.logListContainer}>
                <LogList
                  logs={habits[currentIndex].logs}
                  selectedDate={selectedDate}
                />
              </View>
            </View>
          ) : (
            <AddHabitPage onAddHabit={onAddHabit} />
          )}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  paginationDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDotActive: {
    backgroundColor: '#007AFF',
  },
  paginationText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  paginationTextActive: {
    color: '#fff',
  },
  habitContainer: {
    flex: 1,
    width: '100%',
  },
  habitContent: {
    flex: 1,
  },
  habitHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  habitAvatar: {
    fontSize: 80,
    marginBottom: 16,
  },
  habitName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  logListContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default HabitList; 