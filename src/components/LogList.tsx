import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { HabitLog } from '../types';
import { format, isSameMonth } from 'date-fns';

// Define the props interface for LogList component
// - logs: array of habit logs to display
// - selectedDate: date to filter logs by month
interface LogListProps {
  logs: HabitLog[];
  selectedDate: Date;
}

// LogList component displays a list of habit logs for a selected month
const LogList: React.FC<LogListProps> = ({ logs, selectedDate }) => {
  // Filter logs to show only those from the selected month
  // Sort them by date (newest first)
  const filteredLogs = logs
    .filter(log => isSameMonth(new Date(log.date), selectedDate))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Render individual log item
  // Each log shows the date and notes
  const renderLogItem = ({ item }: { item: HabitLog }) => (
    <View style={styles.logItem}>
      <Text style={styles.logDate}>{format(new Date(item.date), 'MMM d')}</Text>
      <View style={styles.logContent}>
        <Text style={styles.logNotes}>{item.notes}</Text>
      </View>
    </View>
  );

  // Show empty state message if no logs exist for the selected month
  if (filteredLogs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No logs for this month</Text>
      </View>
    );
  }

  // Render the list of logs using FlatList for efficient scrolling
  return (
    <FlatList
      data={filteredLogs}
      renderItem={renderLogItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

// Styles for the component
const styles = StyleSheet.create({
  // Container style for the FlatList
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // Styles for empty state container
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  // Style for empty state text
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  // Style for individual log item container
  logItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  // Style for the date display
  logDate: {
    width: 70,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  // Style for the log content container
  logContent: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
  // Style for the log notes text
  logNotes: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});

export default LogList; 