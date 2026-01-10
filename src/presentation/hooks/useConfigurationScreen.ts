import {useState, useEffect, useCallback} from 'react';
import {Alert} from 'react-native';
import {
  startSmsListening,
  stopSmsListening,
  requestSmsPermissions,
} from '../../adapter/NativeSmsReceiverAdapter';
import {sendSmsAsEmail} from '../../adapter/SmtpEmailSenderAdapter';
import {
  saveConfiguration,
  loadConfiguration,
} from '../../adapter/AsyncStorageAdapter';

export const useConfigurationScreen = () => {
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPassword, setSenderPassword] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const loadSavedConfiguration = async (): Promise<void> => {
      const savedConfig = await loadConfiguration();
      if (savedConfig) {
        setSenderEmail(savedConfig.senderEmail);
        setSenderPassword(savedConfig.senderPassword);
        setRecipientEmail(savedConfig.recipientEmail);
      }
    };
    loadSavedConfiguration();
  }, []);

  const handleSavePress = useCallback(async (): Promise<void> => {
    await saveConfiguration(senderEmail, senderPassword, recipientEmail);
    Alert.alert('Success', 'Configuration saved');
  }, [senderEmail, senderPassword, recipientEmail]);

  const handleToggleListeningPress = useCallback(async (): Promise<void> => {
    if (isListening) {
      stopSmsListening();
      setIsListening(false);
      return;
    }

    const hasPermission = await requestSmsPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'SMS permissions are required');
      return;
    }

    startSmsListening(async smsMessage => {
      try {
        await sendSmsAsEmail(
          smsMessage,
          senderEmail,
          senderPassword,
          recipientEmail,
        );
      } catch (error) {
        console.error('Failed to forward SMS:', error);
        Alert.alert(
          'Email Failed',
          `Failed to forward SMS from ${smsMessage.originatingAddress}`,
        );
      }
    });
    setIsListening(true);
  }, [isListening, senderEmail, senderPassword, recipientEmail]);

  return {
    senderEmail,
    senderPassword,
    recipientEmail,
    isListening,
    onSenderEmailChange: setSenderEmail,
    onSenderPasswordChange: setSenderPassword,
    onRecipientEmailChange: setRecipientEmail,
    onSavePress: handleSavePress,
    onToggleListeningPress: handleToggleListeningPress,
  };
};
