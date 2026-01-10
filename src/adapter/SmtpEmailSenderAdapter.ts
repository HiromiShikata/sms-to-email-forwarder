import RNSmtpMailer from 'react-native-smtp-mailer';
import {SmsMessage} from '../domain/entities/SmsMessage';

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const formatSmsAsEmailBody = (smsMessage: SmsMessage): string => {
  const receivedAtFormatted = smsMessage.receivedAt.toISOString();
  const escapedAddress = escapeHtml(smsMessage.originatingAddress);
  const escapedBody = escapeHtml(smsMessage.messageBody);
  return `<html><body><h2>SMS Received</h2><p><strong>From:</strong> ${escapedAddress}</p><p><strong>Received At:</strong> ${receivedAtFormatted}</p><hr/><p><strong>Message:</strong></p><p>${escapedBody}</p></body></html>`;
};

export const sendSmsAsEmail = async (
  smsMessage: SmsMessage,
  senderEmail: string,
  senderPassword: string,
  recipientEmail: string,
): Promise<void> => {
  await RNSmtpMailer.sendMail({
    mailhost: 'smtp.gmail.com',
    port: '465',
    ssl: true,
    username: senderEmail,
    password: senderPassword,
    fromName: 'SMS Forwarder',
    recipients: recipientEmail,
    subject: `SMS from ${smsMessage.originatingAddress}`,
    htmlBody: formatSmsAsEmailBody(smsMessage),
  });
};
