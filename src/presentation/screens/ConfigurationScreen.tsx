import React from 'react';
import {ConfigurationForm} from '../components/ConfigurationForm';
import {useConfigurationScreen} from '../hooks/useConfigurationScreen';

export const ConfigurationScreen: React.FC = () => {
  const props = useConfigurationScreen();
  return <ConfigurationForm {...props} />;
};
