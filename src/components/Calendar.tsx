import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { format, subMonths, isAfter, startOfMonth } from 'date-fns';

interface CalendarProps {
  date: Date;
  onMonthChange: (newDate: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ date, onMonthChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Generate a list of months from current month backwards
  const getMonthsList = () => {
    const months = [];
    const currentMonth = startOfMonth(new Date()); // Get the current real month
    
    // Start from the current month and go backwards for 24 months
    for (let i = 0; i < 24; i++) {
      const monthDate = subMonths(currentMonth, i);
      months.push(monthDate);
    }
    return months;
  };

  const renderMonthItem = ({ item }: { item: Date }) => (
    <TouchableOpacity
      style={[
        styles.monthItem,
        format(item, 'yyyy-MM') === format(date, 'yyyy-MM') && styles.selectedMonthItem,
      ]}
      onPress={() => {
        onMonthChange(item);
        setShowDropdown(false);
      }}
    >
      <Text
        style={[
          styles.monthItemText,
          format(item, 'yyyy-MM') === format(date, 'yyyy-MM') && styles.selectedMonthItemText,
        ]}
      >
        {format(item, 'MMMM yyyy')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.titleButton}
        onPress={() => setShowDropdown(true)}
      >
        <Text style={styles.monthTitle}>{format(date, 'MMMM yyyy')}</Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            <FlatList
              data={getMonthsList()}
              renderItem={renderMonthItem}
              keyExtractor={(item) => format(item, 'yyyy-MM')}
              showsVerticalScrollIndicator={false}
              initialScrollIndex={0}
              getItemLayout={(data, index) => ({
                length: 50,
                offset: 50 * index,
                index,
              })}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  titleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dropdownIcon: {
    fontSize: 16,
    marginLeft: 8,
    color: '#666',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '80%',
    maxHeight: 400,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  monthItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  selectedMonthItem: {
    backgroundColor: '#f0f8ff',
  },
  monthItemText: {
    fontSize: 18,
    color: '#333',
  },
  selectedMonthItemText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default Calendar; 