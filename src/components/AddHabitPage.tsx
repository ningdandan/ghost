import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface AddHabitPageProps {
  onAddHabit: () => void;
}

const AddHabitPage: React.FC<AddHabitPageProps> = ({ onAddHabit }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.poundSign}>#</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAddHabit}
      >
        <Text style={styles.addButtonText}>Add Habit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  poundSign: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddHabitPage; 