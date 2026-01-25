/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import renderer from 'react-test-renderer';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('../src/adapter/NativeSmsReceiverAdapter', () => ({
  startListening: jest.fn(),
  stopListening: jest.fn(),
  requestPermissions: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('../src/adapter/SmtpEmailSenderAdapter', () => ({
  sendSmsAsEmail: jest.fn(),
}));

jest.mock('../src/adapter/AsyncStorageAdapter', () => ({
  saveConfiguration: jest.fn(),
  loadConfiguration: jest.fn(() => Promise.resolve(null)),
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderer.create(<App />);
  });
});
