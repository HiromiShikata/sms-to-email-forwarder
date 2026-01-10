import RNSmtpMailer from 'react-native-smtp-mailer';
import {sendSmsAsEmail} from '../../src/adapter/SmtpEmailSenderAdapter';
import {SmsMessage} from '../../src/domain/entities/SmsMessage';

jest.mock('react-native-smtp-mailer', () => ({
  sendMail: jest.fn(),
}));

describe('SmtpEmailSenderAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendSmsAsEmail', () => {
    it('should send email with correct parameters', async () => {
      const smsMessage: SmsMessage = {
        originatingAddress: '+81901234567',
        messageBody: 'Test message',
        receivedAt: new Date('2026-01-01T12:00:00.000Z'),
      };

      await sendSmsAsEmail(
        smsMessage,
        'sender@gmail.com',
        'password123',
        'recipient@example.com',
      );

      expect(RNSmtpMailer.sendMail).toHaveBeenCalledWith({
        mailhost: 'smtp.gmail.com',
        port: '465',
        ssl: true,
        username: 'sender@gmail.com',
        password: 'password123',
        fromName: 'SMS Forwarder',
        recipients: 'recipient@example.com',
        subject: 'SMS from +81901234567',
        htmlBody: expect.stringContaining('+81901234567'),
      });
    });

    it('should include message body in email', async () => {
      const smsMessage: SmsMessage = {
        originatingAddress: '+81901234567',
        messageBody: 'Hello World',
        receivedAt: new Date('2026-01-01T12:00:00.000Z'),
      };

      await sendSmsAsEmail(
        smsMessage,
        'sender@gmail.com',
        'password123',
        'recipient@example.com',
      );

      const callArgs = (RNSmtpMailer.sendMail as jest.Mock).mock.calls[0][0];
      expect(callArgs.htmlBody).toContain('Hello World');
    });

    it('should escape HTML special characters in message body', async () => {
      const smsMessage: SmsMessage = {
        originatingAddress: '<script>alert("xss")</script>',
        messageBody: '<b>Bold</b> & "quotes"',
        receivedAt: new Date('2026-01-01T12:00:00.000Z'),
      };

      await sendSmsAsEmail(
        smsMessage,
        'sender@gmail.com',
        'password123',
        'recipient@example.com',
      );

      const callArgs = (RNSmtpMailer.sendMail as jest.Mock).mock.calls[0][0];
      expect(callArgs.htmlBody).toContain('&lt;b&gt;Bold&lt;/b&gt;');
      expect(callArgs.htmlBody).toContain('&amp;');
      expect(callArgs.htmlBody).toContain('&quot;quotes&quot;');
      expect(callArgs.htmlBody).toContain(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      );
      expect(callArgs.htmlBody).not.toContain('<script>');
      expect(callArgs.htmlBody).not.toContain('<b>');
    });
  });
});
