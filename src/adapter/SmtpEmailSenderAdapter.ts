import RNSmtpMailer from 'react-native-smtp-mailer';
import {SmsMessage} from '../domain/entities/SmsMessage';

export type SmtpConfiguration = {
  readonly smtpHost: string;
  readonly smtpPort: number;
  readonly senderEmail: string;
  readonly senderPassword: string;
  readonly recipientEmail: string;
};

const formatSmsAsEmailBody = (smsMessage: SmsMessage): string => {
  const receivedAtFormatted = smsMessage.receivedAt.toISOString();
  return `
    <html>
      <body>
        <h2>SMS Received</h2>
        <p><strong>From:</strong> ${smsMessage.originatingAddress}</p>
        <p><strong>Received At:</strong> ${receivedAtFormatted}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${smsMessage.messageBody}</p>
      </body>
    </html>
  `;
};

const formatEmailSubject = (smsMessage: SmsMessage): string => {
  return `SMS from ${smsMessage.originatingAddress}`;
};

export const sendSmsAsEmail = async (
  smsMessage: SmsMessage,
  configuration: SmtpConfiguration,
): Promise<void> => {
  await RNSmtpMailer.sendMail({
    mailhost: configuration.smtpHost,
    port: String(configuration.smtpPort),
    ssl: true,
    username: configuration.senderEmail,
    password: configuration.senderPassword,
    fromName: 'SMS Forwarder',
    recipients: configuration.recipientEmail,
    subject: formatEmailSubject(smsMessage),
    htmlBody: formatSmsAsEmailBody(smsMessage),
  });
};
