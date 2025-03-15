import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

interface LogInputModalProps {
  visible: boolean;
  onSubmit: (text: string, date: Date) => void;
  onClose: () => void;
}

const LogInputModal: React.FC<LogInputModalProps> = ({ visible, onSubmit, onClose }) => {
  const [text, setText] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim(), date);
      setText('');
      setDate(new Date());
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Log</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {format(date, 'MMMM d, yyyy')}
            </Text>
          </TouchableOpacity>

          {(showDatePicker || Platform.OS === 'ios') && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}
            />
          )}

          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="What did you do?"
            placeholderTextColor="#999"
            multiline
            autoFocus
          />

          <TouchableOpacity
            style={[styles.submitButton, !text.trim() && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!text.trim()}
          >
            <Text style={styles.submitButtonText}>Add Log</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: Platform.OS === 'ios' ? 500 : 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  iosDatePicker: {
    height: 200,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LogInputModal; 