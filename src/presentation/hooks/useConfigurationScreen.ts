import {useState, useEffect, useCallback} from 'react';
import {Alert} from 'react-native';
import {
  startListening,
  stopListening,
  requestPermissions,
} from '../../adapter/NativeSmsReceiverAdapter';
import {
  sendSmsAsEmail,
  SmtpConfiguration,
} from '../../adapter/SmtpEmailSenderAdapter';
import {
  saveConfiguration,
  loadConfiguration,
} from '../../adapter/AsyncStorageAdapter';

const DEFAULT_SMTP_HOST = 'smtp.gmail.com';
const DEFAULT_SMTP_PORT = 465;

type ConfigurationFormProps = {
  senderEmail: string;
  senderPassword: string;
  recipientEmail: string;
  isListening: boolean;
  onSenderEmailChange: (value: string) => void;
  onSenderPasswordChange: (value: string) => void;
  onRecipientEmailChange: (value: string) => void;
  onSavePress: () => void;
  onToggleListeningPress: () => void;
};

export const useConfigurationScreen = (): ConfigurationFormProps => {
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
    const configuration: SmtpConfiguration = {
      smtpHost: DEFAULT_SMTP_HOST,
      smtpPort: DEFAULT_SMTP_PORT,
      senderEmail,
      senderPassword,
      recipientEmail,
    };
    await saveConfiguration(configuration);
    Alert.alert('Success', 'Configuration saved');
  }, [senderEmail, senderPassword, recipientEmail]);

  const handleToggleListeningPress = useCallback(async (): Promise<void> => {
    if (isListening) {
      stopListening();
      setIsListening(false);
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'SMS permissions are required');
      return;
    }

    const configuration: SmtpConfiguration = {
      smtpHost: DEFAULT_SMTP_HOST,
      smtpPort: DEFAULT_SMTP_PORT,
      senderEmail,
      senderPassword,
      recipientEmail,
    };

    startListening(async smsMessage => {
      try {
        await sendSmsAsEmail(smsMessage, configuration);
      } catch (error) {
        console.error('Failed to forward SMS:', error);
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
