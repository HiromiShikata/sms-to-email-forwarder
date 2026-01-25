import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveConfiguration,
  loadConfiguration,
} from '../../src/adapter/AsyncStorageAdapter';
import {SmtpConfiguration} from '../../src/adapter/SmtpEmailSenderAdapter';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe('AsyncStorageAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveConfiguration', () => {
    it('should save configuration to AsyncStorage', async () => {
      const configuration: SmtpConfiguration = {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 465,
        senderEmail: 'sender@gmail.com',
        senderPassword: 'password123',
        recipientEmail: 'recipient@example.com',
      };

      await saveConfiguration(configuration);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@sms_forwarder_config',
        JSON.stringify(configuration),
      );
    });
  });

  describe('loadConfiguration', () => {
    it('should return configuration when stored', async () => {
      const storedConfig: SmtpConfiguration = {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 465,
        senderEmail: 'sender@gmail.com',
        senderPassword: 'password123',
        recipientEmail: 'recipient@example.com',
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(storedConfig),
      );

      const result = await loadConfiguration();

      expect(result).toEqual(storedConfig);
    });

    it('should return null when no configuration is stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await loadConfiguration();

      expect(result).toBeNull();
    });
  });
});
