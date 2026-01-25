import {useState, useEffect, useCallback, useRef} from 'react';
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

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidGmailAppPassword = (password: string): boolean => {
  return password.length === 16 && /^[a-z]+$/.test(password);
};

const validateConfiguration = (
  senderEmail: string,
  senderPassword: string,
  recipientEmail: string,
): string | null => {
  if (!senderEmail.trim()) {
    return 'Sender email is required';
  }
  if (!isValidEmail(senderEmail)) {
    return 'Sender email is not valid';
  }
  if (!senderPassword.trim()) {
    return 'App password is required';
  }
  if (!isValidGmailAppPassword(senderPassword)) {
    return 'App password should be 16 lowercase letters';
  }
  if (!recipientEmail.trim()) {
    return 'Recipient email is required';
  }
  if (!isValidEmail(recipientEmail)) {
    return 'Recipient email is not valid';
  }
  return null;
};

export const useConfigurationScreen = (): ConfigurationFormProps => {
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPassword, setSenderPassword] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false);

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

  useEffect(() => {
    return () => {
      if (isListeningRef.current) {
        stopListening().catch(console.error);
      }
    };
  }, []);

  const handleSavePress = useCallback(async (): Promise<void> => {
    const validationError = validateConfiguration(
      senderEmail,
      senderPassword,
      recipientEmail,
    );
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

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
      await stopListening();
      isListeningRef.current = false;
      setIsListening(false);
      return;
    }

    const validationError = validateConfiguration(
      senderEmail,
      senderPassword,
      recipientEmail,
    );
    if (validationError) {
      Alert.alert('Validation Error', validationError);
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

    await startListening(async smsMessage => {
      try {
        await sendSmsAsEmail(smsMessage, configuration);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        Alert.alert(
          'Email Send Failed',
          `Failed to forward SMS: ${errorMessage}`,
        );
      }
    });
    isListeningRef.current = true;
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
