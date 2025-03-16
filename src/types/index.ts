// Defines what a Habit looks like in your app
export interface Habit {
  id: string;
  name: string;
  avatar: string;
  createdAt: Date;
  logs: HabitLog[];
}

// Defines what a HabitLog looks like in your app
export interface HabitLog {
  id: string;
  habitId: string;
  date: Date;
  notes?: string;
  completed: boolean;
}

// Defines what screens exist and what data they need
export type RootStackParamList = {
  Main: undefined; // Main screen needs no parameters
  EditHabit: { habitId: string }; // EditHabit screen needs a habitId parameter
}; 