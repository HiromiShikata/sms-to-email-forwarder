import AsyncStorage from '@react-native-async-storage/async-storage';

const CONFIG_KEY = '@sms_forwarder_config';

type StoredConfiguration = {
  senderEmail: string;
  senderPassword: string;
  recipientEmail: string;
};

export const saveConfiguration = async (
  senderEmail: string,
  senderPassword: string,
  recipientEmail: string,
): Promise<void> => {
  const config: StoredConfiguration = {
    senderEmail,
    senderPassword,
    recipientEmail,
  };
  await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

export const loadConfiguration = async (): Promise<StoredConfiguration | null> => {
  const stored = await AsyncStorage.getItem(CONFIG_KEY);
  if (!stored) {
    return null;
  }
  return JSON.parse(stored) as StoredConfiguration;
};
