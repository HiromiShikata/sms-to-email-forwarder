module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-smtp-mailer|@react-native-async-storage/async-storage)/)',
  ],
  setupFiles: ['./jest.setup.js'],
};
