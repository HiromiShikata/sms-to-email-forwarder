import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveConfiguration,
  loadConfiguration,
} from '../../src/adapter/AsyncStorageAdapter';

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
      await saveConfiguration(
        'sender@gmail.com',
        'password123',
        'recipient@example.com',
      );

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@sms_forwarder_config',
        JSON.stringify({
          senderEmail: 'sender@gmail.com',
          senderPassword: 'password123',
          recipientEmail: 'recipient@example.com',
        }),
      );
    });
  });

  describe('loadConfiguration', () => {
    it('should return null when no configuration is stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await loadConfiguration();

      expect(result).toBeNull();
    });

    it('should return parsed configuration when stored', async () => {
      const storedConfig = {
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
  });
});
