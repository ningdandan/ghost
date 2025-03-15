export interface Habit {
  id: string;
  name: string;
  avatar: string;
  createdAt: Date;
  logs: HabitLog[];
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: Date;
  notes?: string;
  completed: boolean;
}

export type RootStackParamList = {
  Main: undefined;
  EditHabit: { habitId: string };
}; 