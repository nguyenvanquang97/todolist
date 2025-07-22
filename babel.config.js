module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@context': './src/context',
          '@styles': './src/styles',
          '@utils': './src/utils',
          '@database': './src/database',
          '@navigation': './src/navigation',
          '@services': './src/services',
          '@types': './src/types',
          '@i18n': './src/i18n',
        },
      },
    ],
  ],
};
