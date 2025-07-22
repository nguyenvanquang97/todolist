import React, { useEffect } from 'react';
import { StatusBar, Platform, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { TaskProvider } from './src/context/TaskContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/styles/theme';
import notifee from '@notifee/react-native';

const App: React.FC = () => {
  useEffect(() => {
    // Yêu cầu quyền thông báo trên Android 13+
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        // Kiểm tra phiên bản Android
        if (Platform.Version >= 33) {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
        }
      } else if (Platform.OS === 'ios') {
        // Yêu cầu quyền thông báo trên iOS
        await notifee.requestPermission();
      }
    };

    requestPermissions();
  }, []);

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
