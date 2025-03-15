import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AvatarPicker from '../components/AvatarPicker';
import { useHabits } from '../hooks/useHabits';

type AddHabitScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddHabit'>;
};

const AddHabitScreen: React.FC<AddHabitScreenProps> = ({ navigation }) => {
  const [habitName, setHabitName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎯');
  const { addHabit } = useHabits();

  const handleCreateHabit = async () => {
    if (!habitName.trim()) return;

    await addHabit(habitName.trim(), selectedAvatar);
    navigation.goBack();
  };

  const isValid = habitName.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Habit</Text>
          <TouchableOpacity
            onPress={handleCreateHabit}
            disabled={!isValid}
            style={[styles.createButton, !isValid && styles.createButtonDisabled]}
          >
            <Text style={[styles.createButtonText, !isValid && styles.createButtonTextDisabled]}>
              Create
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={habitName}
              onChangeText={setHabitName}
              placeholder="Enter habit name"
              placeholderTextColor="#999"
              autoFocus
            />
            <AvatarPicker
              selectedAvatar={selectedAvatar}
              onSelect={setSelectedAvatar}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
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
});

export default AddHabitScreen; 