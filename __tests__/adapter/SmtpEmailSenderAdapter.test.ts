import RNSmtpMailer from 'react-native-smtp-mailer';
import {sendSmsAsEmail, SmtpConfiguration} from '../../src/adapter/SmtpEmailSenderAdapter';
import {SmsMessage} from '../../src/domain/entities/SmsMessage';

jest.mock('react-native-smtp-mailer', () => ({
  sendMail: jest.fn(),
}));

describe('SmtpEmailSenderAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendSmsAsEmail', () => {
    it('should call RNSmtpMailer.sendMail with correct parameters', async () => {
      const smsMessage: SmsMessage = {
        originatingAddress: '+81901234567',
        messageBody: 'Test message',
        receivedAt: new Date('2026-01-01T12:00:00.000Z'),
      };

      const configuration: SmtpConfiguration = {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 465,
        senderEmail: 'sender@gmail.com',
        senderPassword: 'password123',
        recipientEmail: 'recipient@example.com',
      };

      (RNSmtpMailer.sendMail as jest.Mock).mockResolvedValue(undefined);

      await sendSmsAsEmail(smsMessage, configuration);

      expect(RNSmtpMailer.sendMail).toHaveBeenCalledTimes(1);
      expect(RNSmtpMailer.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          mailhost: 'smtp.gmail.com',
          port: '465',
          ssl: true,
          username: 'sender@gmail.com',
          password: 'password123',
          fromName: 'SMS Forwarder',
          recipients: 'recipient@example.com',
          subject: 'SMS from +81901234567',
        }),
      );
    });

    it('should format email subject correctly', async () => {
      const smsMessage: SmsMessage = {
        originatingAddress: 'Unknown',
        messageBody: 'Test',
        receivedAt: new Date(),
      };

      const configuration: SmtpConfiguration = {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 465,
        senderEmail: 'sender@gmail.com',
        senderPassword: 'password123',
        recipientEmail: 'recipient@example.com',
      };

      (RNSmtpMailer.sendMail as jest.Mock).mockResolvedValue(undefined);

      await sendSmsAsEmail(smsMessage, configuration);

      expect(RNSmtpMailer.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'SMS from Unknown',
        }),
      );
    });
  });
});
