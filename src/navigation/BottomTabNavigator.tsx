import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SettingsScreen from '@screens/SettingsScreen';
import TaskStackNavigator from './RootStackNavigator';
import {useTheme} from '@context/ThemeContext';
import {baseColors} from '@styles/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from '@i18n/i18n';
import TaskListScreen from '@/screens/TaskListScreen';
import ManagementScreen from '@/screens/ManagementScreen';
import StatisticsScreen from '@/screens/StatisticsScreen';

export type RootTabParamList = {
  TaskList: undefined | {screen: string; params?: any};
  Management: undefined;
  Statistics: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// Tạo hàm tabBarIcon riêng biệt để tránh định nghĩa component trong quá trình render
const getTabBarIcon = (route: string) => {
  return ({
    focused,
    color,
    size,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }) => {
    let iconName = '';

    if (route === 'TaskList') {
      iconName = focused ? 'list' : 'list-outline';
    } else if (route === 'Management') {
      iconName = focused ? 'folder' : 'folder-outline';
    } else if (route === 'Statistics') {
      iconName = focused ? 'bar-chart' : 'bar-chart-outline';
    } else if (route === 'Settings') {
      iconName = focused ? 'settings' : 'settings-outline';
    }

    return <Icon name={iconName} size={size} color={color} />;
  };
};

const BottomTabNavigator: React.FC = () => {
  const {colors} = useTheme();
  const {t} = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: getTabBarIcon(route.name),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.navigationBar,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{
          title: t('taskList.title'),
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.bg_primary,
          },
          headerTintColor: baseColors.white,
          headerTitleStyle: {
            fontWeight: 'bold' as const,
          },
        }}
      />
      <Tab.Screen
        name="Management"
        component={ManagementScreen}
        options={{
          title: t('settings.organization'),
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.bg_primary,
          },
          headerTintColor: baseColors.white,
          headerTitleStyle: {
            fontWeight: 'bold' as const,
          },
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          title: t('statistics.title'),
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.bg_primary,
          },
          headerTintColor: baseColors.white,
          headerTitleStyle: {
            fontWeight: 'bold' as const,
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t('settings.title'),
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.bg_primary,
          },
          headerTintColor: baseColors.white,
          headerTitleStyle: {
            fontWeight: 'bold' as const,
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
