import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { HabitLog } from '../types';
import { format, isSameMonth } from 'date-fns';

interface LogListProps {
  logs: HabitLog[];
  selectedDate: Date;
}

const LogList: React.FC<LogListProps> = ({ logs, selectedDate }) => {
  const filteredLogs = logs
    .filter(log => isSameMonth(new Date(log.date), selectedDate))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const renderLogItem = ({ item }: { item: HabitLog }) => (
    <View style={styles.logItem}>
      <Text style={styles.logDate}>{format(new Date(item.date), 'MMM d')}</Text>
      <View style={styles.logContent}>
        <Text style={styles.logNotes}>{item.notes}</Text>
      </View>
    </View>
  );

  if (filteredLogs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No logs for this month</Text>
      </View>
    );
  }

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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  logItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  logDate: {
    width: 70,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  logContent: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
  logNotes: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});

export default LogList; 