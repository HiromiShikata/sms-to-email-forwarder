import {SmsMessage} from '../../../src/domain/entities/SmsMessage';

describe('SmsMessage', () => {
  it('should create SmsMessage with all required properties', () => {
    const receivedAt = new Date('2026-01-01T12:00:00.000Z');
    const smsMessage: SmsMessage = {
      originatingAddress: '+81901234567',
      messageBody: 'Test message',
      receivedAt,
    };

    expect(smsMessage.originatingAddress).toBe('+81901234567');
    expect(smsMessage.messageBody).toBe('Test message');
    expect(smsMessage.receivedAt).toBe(receivedAt);
  });

  it('should be readonly', () => {
    const receivedAt = new Date('2026-01-01T12:00:00.000Z');
    const smsMessage: SmsMessage = {
      originatingAddress: '+81901234567',
      messageBody: 'Test message',
      receivedAt,
    };

    expect(smsMessage.originatingAddress).toBe('+81901234567');
    expect(smsMessage.messageBody).toBe('Test message');
    expect(smsMessage.receivedAt).toEqual(receivedAt);
  });
});
