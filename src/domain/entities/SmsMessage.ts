export type SmsMessage = {
  readonly originatingAddress: string;
  readonly messageBody: string;
  readonly receivedAt: Date;
};
