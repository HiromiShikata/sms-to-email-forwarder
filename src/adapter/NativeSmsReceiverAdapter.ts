import {
  NativeModules,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {SmsMessage} from '../domain/entities/SmsMessage';

const {SmsReceiverModule} = NativeModules;

type NativeSmsEvent = {
  originatingAddress: string;
  messageBody: string;
  receivedAt: string;
};

const convertNativeEventToSmsMessage = (event: NativeSmsEvent): SmsMessage => ({
  originatingAddress: event.originatingAddress,
  messageBody: event.messageBody,
  receivedAt: new Date(event.receivedAt),
});

let eventEmitter: NativeEventEmitter | null = null;
let subscription: {remove: () => void} | null = null;

export const startSmsListening = (
  onSmsReceived: (smsMessage: SmsMessage) => void,
): void => {
  eventEmitter = new NativeEventEmitter(SmsReceiverModule);
  subscription = eventEmitter.addListener(
    'onSmsReceived',
    (event: NativeSmsEvent) => {
      const smsMessage = convertNativeEventToSmsMessage(event);
      onSmsReceived(smsMessage);
    },
  );
  SmsReceiverModule.startListening();
};

export const stopSmsListening = (): void => {
  subscription?.remove();
  subscription = null;
  SmsReceiverModule.stopListening();
};

export const requestSmsPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false;
  }
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.READ_SMS,
    PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
  ]);
  return (
    granted[PermissionsAndroid.PERMISSIONS.READ_SMS] ===
      PermissionsAndroid.RESULTS.GRANTED &&
    granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] ===
      PermissionsAndroid.RESULTS.GRANTED
  );
};
