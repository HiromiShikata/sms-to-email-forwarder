import React from 'react';
import {ConfigurationForm} from './ConfigurationForm';

export default {
  title: 'Components/ConfigurationForm',
  component: ConfigurationForm,
};

export const Default = () => (
  <ConfigurationForm
    senderEmail=""
    senderPassword=""
    recipientEmail=""
    isListening={false}
    onSenderEmailChange={() => {}}
    onSenderPasswordChange={() => {}}
    onRecipientEmailChange={() => {}}
    onSavePress={() => {}}
    onToggleListeningPress={() => {}}
  />
);

export const WithValues = () => (
  <ConfigurationForm
    senderEmail="sender@gmail.com"
    senderPassword="abcdefghijklmnop"
    recipientEmail="recipient@example.com"
    isListening={false}
    onSenderEmailChange={() => {}}
    onSenderPasswordChange={() => {}}
    onRecipientEmailChange={() => {}}
    onSavePress={() => {}}
    onToggleListeningPress={() => {}}
  />
);

export const Listening = () => (
  <ConfigurationForm
    senderEmail="sender@gmail.com"
    senderPassword="abcdefghijklmnop"
    recipientEmail="recipient@example.com"
    isListening={true}
    onSenderEmailChange={() => {}}
    onSenderPasswordChange={() => {}}
    onRecipientEmailChange={() => {}}
    onSavePress={() => {}}
    onToggleListeningPress={() => {}}
  />
);
