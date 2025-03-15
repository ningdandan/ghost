import { useState, useEffect, useCallback } from 'react';
import { Habit } from '../types';
import { storage } from '../services/storage';
import { format } from 'date-fns';

// For debugging
const logData = (message: string, data?: any) => {
  console.log(`[useHabits] ${message}`, data || '');
};

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHabits = useCallback(async () => {
    try {
      logData('Loading habits');
      setLoading(true);
      setError(null);
      
      const loadedHabits = await storage.loadHabits();
      logData('Loaded habits:', loadedHabits);
      
      setHabits(loadedHabits);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load habits';
      console.error('[useHabits] Error loading habits:', err);
      setError(errorMessage);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshHabits = useCallback(async () => {
    try {
      logData('Refreshing habits');
      setError(null);
      
      const loadedHabits = await storage.loadHabits();
      logData('Refreshed habits:', loadedHabits);
      
      setHabits(loadedHabits);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh habits';
      console.error('[useHabits] Error refreshing habits:', err);
      setError(errorMessage);
    }
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const saveHabits = useCallback(async (updatedHabits: Habit[]) => {
    try {
      logData('Saving habits:', updatedHabits);
      setError(null);
      
      await storage.saveHabits(updatedHabits);
      logData('Habits saved successfully');
      
      setHabits(updatedHabits);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save habits';
      console.error('[useHabits] Error saving habits:', err);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const addHabit = useCallback(async (name: string, avatar: string) => {
    try {
      logData('Adding new habit:', { name, avatar });
      setError(null);
      
      const newHabit: Habit = {
        id: Date.now().toString(),
        name,
        avatar,
        createdAt: new Date(),
        logs: [],
      };
      
      logData('Created new habit object:', newHabit);
      const updatedHabits = [...habits, newHabit];
      await saveHabits(updatedHabits);
      
      logData('Habit added successfully');
      return newHabit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add habit';
      console.error('[useHabits] Error adding habit:', err);
      setError(errorMessage);
      throw err;
    }
  }, [habits, saveHabits]);

  const addLog = useCallback(async (habitId: string, note: string, date: Date = new Date()) => {
    try {
      logData('Adding log:', { habitId, note, date });
      setError(null);
      
      const updatedHabits = habits.map(habit => {
        if (habit.id === habitId) {
          const existingLogIndex = habit.logs.findIndex(log => 
            format(log.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          );

          if (existingLogIndex !== -1) {
            const updatedLogs = [...habit.logs];
            updatedLogs[existingLogIndex] = {
              ...updatedLogs[existingLogIndex],
              notes: `${updatedLogs[existingLogIndex].notes}\n${note}`,
            };
            return { ...habit, logs: updatedLogs };
          } else {
            return {
              ...habit,
              logs: [
                ...habit.logs,
                {
                  id: Date.now().toString(),
                  habitId,
                  date,
                  notes: note,
                  completed: true,
                },
              ],
            };
          }
        }
        return habit;
      });

      await saveHabits(updatedHabits);
      logData('Log added successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add log';
      console.error('[useHabits] Error adding log:', err);
      setError(errorMessage);
      throw err;
    }
  }, [habits, saveHabits]);

  return {
    habits,
    loading,
    error,
    addHabit,
    addLog,
    loadHabits,
    refreshHabits,
  };
}; 