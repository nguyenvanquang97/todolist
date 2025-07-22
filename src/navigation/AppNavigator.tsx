import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TaskListScreen from '@screens/TaskListScreen';
import AddEditTaskScreen from '@screens/AddEditTaskScreen';
import TaskDetailScreen from '@screens/TaskDetailScreen';
import SettingsScreen from '@screens/SettingsScreen';
import { useTheme } from '@context/ThemeContext';
import { baseColors } from '@styles/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '@i18n/i18n';
import { Task } from '@/types/Task';


// Import screens

export type TaskStackParamList = {
  TaskList: undefined;
  AddEditTask: {
    task?: Task;
    mode: 'add' | 'edit';
  };
  TaskDetail: {
    task: Task;
  };
};

export type RootTabParamList = {
  TaskStack: undefined;
  Settings: undefined;
};

const TaskStack = createStackNavigator<TaskStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const TaskStackNavigator: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <TaskStack.Navigator
      initialRouteName="TaskList"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.bg_primary,
        },
        headerTintColor: baseColors.white,
        headerTitleStyle: {
          fontWeight: 'bold' as const,
        },
      }}
    >
      <TaskStack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{
          title: t('taskList.title'),
        }}
      />
      <TaskStack.Screen
        name="AddEditTask"
        component={AddEditTaskScreen}
        options={({ route }) => ({
          title: route.params.mode === 'add' ? t('task.add') : t('task.edit'),
        })}
      />
      <TaskStack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{
          title: t('taskDetail.title'),
        }}
      />
    </TaskStack.Navigator>
  );
};

// Tạo hàm tabBarIcon riêng biệt để tránh định nghĩa component trong quá trình render
const getTabBarIcon = (route: string) => {
  return ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
    let iconName = '';

    if (route === 'TaskStack') {
      iconName = focused ? 'list' : 'list-outline';
    } else if (route === 'Settings') {
      iconName = focused ? 'settings' : 'settings-outline';
    }

    return <Icon name={iconName} size={size} color={color} />;
  };
};

const AppNavigator: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: getTabBarIcon(route.name),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="TaskStack"
        component={TaskStackNavigator}
        options={{
          title: t('taskList.title'),
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

export default AppNavigator;
