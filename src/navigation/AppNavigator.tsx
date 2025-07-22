import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Task } from '../types/Task';
import TaskListScreen from '@screens/TaskListScreen';
import AddEditTaskScreen from '@screens/AddEditTaskScreen';
import TaskDetailScreen from '@screens/TaskDetailScreen';
import SettingsScreen from '@screens/SettingsScreen';
import { useTheme } from '@context/ThemeContext';
import { baseColors } from '@styles/theme';
import Icon from 'react-native-vector-icons/Ionicons';

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
          title: 'Danh sách công việc',
        }}
      />
      <TaskStack.Screen
        name="AddEditTask"
        component={AddEditTaskScreen}
        options={({ route }) => ({
          title: route.params.mode === 'add' ? 'Thêm công việc' : 'Sửa công việc',
        })}
      />
      <TaskStack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{
          title: 'Chi tiết công việc',
        }}
      />
    </TaskStack.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'TaskStack') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
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
          title: 'Công việc',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          title: 'Cài đặt',
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