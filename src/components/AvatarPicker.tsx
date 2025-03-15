import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// We'll use emoji as avatars for now, can be replaced with custom icons later
const AVATARS = ['🏃‍♂️', '💪', '📚', '🧘‍♂️', '💧', '🥗', '😴', '🎯', '✍️', '🎨', '🎸', '🧠'];

interface AvatarPickerProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
  disabled?: boolean;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedAvatar, onSelect, disabled }) => {
  return (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>Choose an icon</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.avatarGrid}>
          {AVATARS.map((avatar) => (
            <TouchableOpacity
              key={avatar}
              style={[
                styles.avatarButton,
                selectedAvatar === avatar && styles.selectedAvatar,
                disabled && styles.avatarButtonDisabled,
              ]}
              onPress={() => !disabled && onSelect(avatar)}
              disabled={disabled}
            >
              <Text style={[
                styles.avatarText,
                disabled && styles.avatarTextDisabled
              ]}>{avatar}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  containerDisabled: {
    opacity: 0.7,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  labelDisabled: {
    color: '#999',
  },
  avatarGrid: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  avatarButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarButtonDisabled: {
    backgroundColor: '#f0f0f0',
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: '#007AFF',
    backgroundColor: '#fff',
  },
  avatarText: {
    fontSize: 24,
  },
  avatarTextDisabled: {
    opacity: 0.5,
  },
});

export default AvatarPicker; 