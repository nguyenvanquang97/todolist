import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { TaskProvider } from './src/context/TaskContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/styles/theme';

const App: React.FC = () => {
  return (
    <TaskProvider>
      <NavigationContainer>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.primary}
        />
        <AppNavigator />
      </NavigationContainer>
    </TaskProvider>
  );
};

export default App;
