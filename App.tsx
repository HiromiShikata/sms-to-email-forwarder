import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {ConfigurationScreen} from './src/presentation/screens/ConfigurationScreen';

const App = (): React.JSX.Element => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ConfigurationScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
