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

interface HabitListProps {
  habits: Habit[];
  selectedDate: Date;
  onAddLog: (habitId: string) => void;
  onAddHabit: () => void;
  currentHabitId?: string;
  onHabitChange?: (habitId: string) => void;
}

const { width } = Dimensions.get('window');

const HabitList: React.FC<HabitListProps> = ({
  habits,
  selectedDate,
  onAddLog,
  onAddHabit,
  currentHabitId,
  onHabitChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);

  const updateIndex = useCallback((newIndex: number) => {
    setCurrentIndex(newIndex);
    if (onHabitChange && habits[newIndex]) {
      onHabitChange(habits[newIndex].id);
    }
  }, [habits, onHabitChange]);

  const handleGestureEvent = useCallback((event: any) => {
    translateX.value = event.translationX;
  }, []);

  const handleGestureEnd = useCallback(() => {
    if (Math.abs(translateX.value) > width * 0.3) {
      const newIndex = translateX.value > 0 
        ? Math.max(0, currentIndex - 1)
        : Math.min(habits.length, currentIndex + 1);
      updateIndex(newIndex);
    }
    translateX.value = withSpring(0);
  }, [currentIndex, habits.length, updateIndex]);

  // Set initial habit ID
  React.useEffect(() => {
    if (habits.length > 0 && onHabitChange && !currentHabitId) {
      onHabitChange(habits[0].id);
    }
  }, [habits, onHabitChange, currentHabitId]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (habits.length === 0) {
    return (
      <View style={styles.container}>
        <AddHabitPage onAddHabit={onAddHabit} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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