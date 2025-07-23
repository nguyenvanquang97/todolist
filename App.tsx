import React, {useEffect} from 'react';
import {StatusBar, Platform, PermissionsAndroid} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {TaskProvider} from './src/context/TaskContext';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import {SettingsProvider} from './src/context/SettingsContext';
import notifee from '@notifee/react-native';
import {RootStackNavigator, navigationRef} from '@/navigation/index';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

// Component StatusBar tùy chỉnh theo theme
const AppStatusBar: React.FC = () => {
  const {isDarkMode, colors} = useTheme();

  useEffect(() => {
    // Thay đổi màu thanh điều hướng Android theo theme
    if (Platform.OS === 'android') {
      try {
        // Đặt màu thanh điều hướng theo theme hiện tại
        changeNavigationBarColor(
          colors.navigationBar, // Sử dụng màu navigationBar từ theme
          !isDarkMode, // Light icons nếu theme tối
          false, // Không animation
        );
      } catch (e) {
        console.error('Không thể thay đổi màu thanh điều hướng:', e);
      }
    }
  }, [isDarkMode, colors]);

  return (
    <StatusBar
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      backgroundColor={colors.statusBar}
    />
  );
};

const App: React.FC = () => {
  useEffect(() => {
    // Yêu cầu quyền thông báo trên Android 13+
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        // Kiểm tra phiên bản Android
        if (Platform.Version >= 33) {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
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
    <SettingsProvider>
      <ThemeProvider>
        <TaskProvider>
          <AppStatusBar />
          <NavigationContainer ref={navigationRef}>
            <RootStackNavigator />
          </NavigationContainer>
        </TaskProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
};

export default App;
