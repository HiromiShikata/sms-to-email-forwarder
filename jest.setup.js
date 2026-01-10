jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-smtp-mailer', () => ({
  sendMail: jest.fn(),
}));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('react-native', () => {
  const ReactNative = jest.requireActual('react-native');
  ReactNative.NativeModules.SmsReceiverModule = {
    startListening: jest.fn(),
    stopListening: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  };
  return ReactNative;
});
