import { Habit } from '../types';
import mockHabits from '../data/mockHabits.json';

const STORAGE_KEY = 'habits_data';

// For debugging
const logData = (message: string, data?: any) => {
  console.log(`[Storage] ${message}`, data || '');
};

export const storage = {
  async initialize() {
    try {
      logData('Initializing storage');
      const existingData = localStorage.getItem(STORAGE_KEY);
      logData('Existing data:', existingData);

      if (!existingData) {
        logData('No existing data, setting mock data');
        logData('Mock data structure:', mockHabits);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockHabits));
        logData('Mock data set successfully');
      }
    } catch (error) {
      console.error('[Storage] Error initializing storage:', error);
      throw error;
    }
  },

  async loadHabits(): Promise<Habit[]> {
    try {
      logData('Loading habits');
      await this.initialize();
      
      const content = localStorage.getItem(STORAGE_KEY);
      logData('Raw content from storage:', content);
      
      if (!content) {
        logData('No content found, returning empty array');
        return [];
      }

      const data = JSON.parse(content);
      logData('Parsed data:', data);

      // Handle all possible data shapes
      let habitsArray: any[] = [];
      if (Array.isArray(data)) {
        logData('Data is an array');
        habitsArray = data;
      } else if (data && data.habits && Array.isArray(data.habits)) {
        logData('Data has habits array property');
        habitsArray = data.habits;
      } else if (typeof data === 'object') {
        logData('Data is a single object');
        habitsArray = [data];
      }

      logData('Final habits array:', habitsArray);

      const processedHabits = habitsArray.map((habit: any) => ({
        ...habit,
        createdAt: new Date(habit.createdAt),
        logs: Array.isArray(habit.logs) ? habit.logs.map((log: any) => ({
          ...log,
          date: new Date(log.date),
        })) : [],
      }));

      logData('Processed habits:', processedHabits);
      return processedHabits;
    } catch (error) {
      console.error('[Storage] Error loading habits:', error);
      throw error;
    }
  },

  async saveHabits(habits: Habit[]) {
    try {
      logData('Saving habits:', habits);
      
      // Create a safe copy of the data for storage
      const safeHabits = habits.map(habit => ({
        id: habit.id,
        name: habit.name,
        avatar: habit.avatar,
        createdAt: habit.createdAt.toISOString(),
        logs: habit.logs.map(log => ({
          id: log.id,
          habitId: log.habitId,
          date: log.date.toISOString(),
          notes: log.notes || '',
          completed: log.completed,
        })),
      }));

      const data = { habits: safeHabits };
      logData('Saving data structure:', data);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      logData('Habits saved successfully');
      
      return data;
    } catch (error) {
      console.error('[Storage] Error saving habits:', error);
      throw error;
    }
  },

  async resetToMockData() {
    try {
      logData('Resetting to mock data');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockHabits));
      logData('Reset successful');
    } catch (error) {
      console.error('[Storage] Error resetting to mock data:', error);
      throw error;
    }
  },
}; 