import React, {useEffect, Fragment} from 'react';
import {StatusBar, Platform, PermissionsAndroid} from 'react-native';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {TaskProvider} from './src/context/TaskContext';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import {SettingsProvider} from './src/context/SettingsContext';
import {ProjectProvider} from './src/context/ProjectContext';
import notifee from '@notifee/react-native';
import {RootStackNavigator, navigationRef} from '@/navigation/index';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import ToastContainer from './src/components/Toast';
import { ConfirmDialogContainer } from './src/components/ConfirmDialog';

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

// Component nội dung ứng dụng với NavigationContainer đã được theme hóa
const AppContent: React.FC = () => {
  const { isDarkMode, colors } = useTheme();
  
  // Tạo theme cho NavigationContainer
  const navigationTheme = isDarkMode
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          notification: colors.danger,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          notification: colors.danger,
        },
      };

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
    <>
      <AppStatusBar />
      <NavigationContainer
        ref={navigationRef}
        theme={navigationTheme}
      >
        <RootStackNavigator />
      </NavigationContainer>
      <ToastContainer />
      <ConfirmDialogContainer />
    </>
  );
};

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <TaskProvider>
          <ProjectProvider>
            <AppContent />
          </ProjectProvider>
        </TaskProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
};

export default App;
