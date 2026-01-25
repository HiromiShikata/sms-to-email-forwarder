import AsyncStorage from '@react-native-async-storage/async-storage';
import {SmtpConfiguration} from './SmtpEmailSenderAdapter';

const CONFIG_STORAGE_KEY = '@sms_forwarder_config';

export const saveConfiguration = async (
  configuration: SmtpConfiguration,
): Promise<void> => {
  await AsyncStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configuration));
};

export const loadConfiguration =
  async (): Promise<SmtpConfiguration | null> => {
    const stored = await AsyncStorage.getItem(CONFIG_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as SmtpConfiguration;
  };
