import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import TaskListScreen from '@screens/TaskListScreen';
import AddEditTaskScreen from '@screens/AddEditTaskScreen';
import TaskDetailScreen from '@screens/TaskDetailScreen';
import CategoryManagementScreen from '@screens/CategoryManagementScreen';
import TagManagementScreen from '@screens/TagManagementScreen';
import CategoryTagManagementScreen from '@screens/CategoryTagManagementScreen';
import ProjectManagementScreen from '@screens/ProjectManagementScreen';
import BackupScreen from '@screens/BackupScreen';
import {useTheme} from '@context/ThemeContext';
import {baseColors} from '@styles/theme';
import {useTranslation} from '@i18n/i18n';
import {Task} from '@/types/Task';
import BottomTabNavigator from './BottomTabNavigator';

export type RootStackParamList = {
  BottomTabNavigator: undefined | {screen: string; params?: any};
  TaskList: undefined;
  AddEditTask: {
    task?: Task;
    mode: 'add' | 'edit';
  };
  TaskDetail: {
    taskId: number;
  };
  CategoryTagManagement: undefined;
  CategoryManagement: undefined;
  TagManagement: undefined;
  ProjectManagement: undefined;
  BackupScreen: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

const RootStackNavigator: React.FC = () => {
  const {colors} = useTheme();
  const {t} = useTranslation();

  return (
    <RootStack.Navigator
      initialRouteName="BottomTabNavigator"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.bg_primary,
        },
        headerTintColor: baseColors.white,
        headerTitleStyle: {
          fontWeight: 'bold' as const,
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}>
      <RootStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />

      <RootStack.Screen
        name="AddEditTask"
        component={AddEditTaskScreen}
        options={({route}) => ({
          title: route.params.mode === 'add' ? t('task.add') : t('task.edit'),
        })}
      />
      <RootStack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{
          title: t('taskDetail.title'),
        }}
      />
      <RootStack.Screen
        name="CategoryTagManagement"
        component={CategoryTagManagementScreen}
        options={{
          title: t('categoryTagManagement.title'),
        }}
      />
      <RootStack.Screen
        name="CategoryManagement"
        component={CategoryManagementScreen}
        options={{
          title: t('categoryManagement.title'),
        }}
      />
      <RootStack.Screen
        name="TagManagement"
        component={TagManagementScreen}
        options={{
          title: t('tagManagement.title'),
        }}
      />
      <RootStack.Screen
        name="ProjectManagement"
        component={ProjectManagementScreen}
        options={{
          title: t('projectManagement.title'),
        }}
      />
      <RootStack.Screen
        name="BackupScreen"
        component={BackupScreen}
        options={{
          title: t('backup.title'),
        }}
      />
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
