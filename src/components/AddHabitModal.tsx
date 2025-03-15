import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { AvatarPicker } from '.';
import { useHabits } from '../hooks/useHabits';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({ visible, onClose }) => {
  const [habitName, setHabitName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎯');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addHabit, refreshHabits } = useHabits();

  const handleCreateHabit = useCallback(async () => {
    if (!habitName.trim()) return;
    
    try {
      console.log('[AddHabitModal] Creating habit:', { name: habitName, avatar: selectedAvatar });
      setError(null);
      setIsSubmitting(true);
      
      await addHabit(habitName.trim(), selectedAvatar);
      console.log('[AddHabitModal] Habit created successfully');
      
      await refreshHabits();
      console.log('[AddHabitModal] Habits refreshed');
      
      setHabitName('');
      setSelectedAvatar('🎯');
      onClose();
    } catch (err) {
      console.error('[AddHabitModal] Error creating habit:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create habit';
      setError(errorMessage);
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [habitName, selectedAvatar, addHabit, refreshHabits, onClose]);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setHabitName('');
      setSelectedAvatar('🎯');
      setError(null);
      onClose();
    }
  }, [isSubmitting, onClose]);

  const isValid = habitName.trim().length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContent}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.cancelButton}
              disabled={isSubmitting}
            >
              <Text style={[styles.cancelButtonText, isSubmitting && styles.disabledText]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={styles.title}>New Habit</Text>
            <TouchableOpacity
              onPress={handleCreateHabit}
              disabled={!isValid || isSubmitting}
              style={[
                styles.createButton,
                (!isValid || isSubmitting) && styles.createButtonDisabled
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Text style={[
                  styles.createButtonText,
                  (!isValid || isSubmitting) && styles.createButtonTextDisabled
                ]}>
                  Create
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.form}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                value={habitName}
                onChangeText={(text) => {
                  setHabitName(text);
                  setError(null);
                }}
                placeholder="Enter habit name"
                placeholderTextColor="#999"
                autoFocus
                editable={!isSubmitting}
              />
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
              <AvatarPicker
                selectedAvatar={selectedAvatar}
                onSelect={setSelectedAvatar}
                disabled={isSubmitting}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 17,
  },
  createButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  createButtonTextDisabled: {
    color: '#999',
  },
  disabledText: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    marginTop: 8,
    fontSize: 14,
  },
});

export default AddHabitModal; 