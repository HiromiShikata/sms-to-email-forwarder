import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export const ConfigurationForm: React.FC<{
  senderEmail: string;
  senderPassword: string;
  recipientEmail: string;
  isListening: boolean;
  onSenderEmailChange: (value: string) => void;
  onSenderPasswordChange: (value: string) => void;
  onRecipientEmailChange: (value: string) => void;
  onSavePress: () => void;
  onToggleListeningPress: () => void;
}> = ({
  senderEmail,
  senderPassword,
  recipientEmail,
  isListening,
  onSenderEmailChange,
  onSenderPasswordChange,
  onRecipientEmailChange,
  onSavePress,
  onToggleListeningPress,
}) => (
  <View style={styles.container}>
    <Text style={styles.title}>SMS to Email Forwarder</Text>

    <Text style={styles.label}>Sender Email (Gmail)</Text>
    <TextInput
      style={styles.input}
      value={senderEmail}
      onChangeText={onSenderEmailChange}
      placeholder="your-email@gmail.com"
      keyboardType="email-address"
      autoCapitalize="none"
    />

    <Text style={styles.label}>App Password</Text>
    <TextInput
      style={styles.input}
      value={senderPassword}
      onChangeText={onSenderPasswordChange}
      placeholder="16-character app password"
      secureTextEntry
    />

    <Text style={styles.label}>Recipient Email</Text>
    <TextInput
      style={styles.input}
      value={recipientEmail}
      onChangeText={onRecipientEmailChange}
      placeholder="recipient@example.com"
      keyboardType="email-address"
      autoCapitalize="none"
    />

    <TouchableOpacity style={styles.saveButton} onPress={onSavePress}>
      <Text style={styles.buttonText}>Save Configuration</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.toggleButton, isListening && styles.toggleButtonActive]}
      onPress={onToggleListeningPress}>
      <Text style={styles.buttonText}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </Text>
    </TouchableOpacity>

    <Text style={styles.statusText}>
      Status: {isListening ? 'Listening for SMS...' : 'Not listening'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleButtonActive: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
});
