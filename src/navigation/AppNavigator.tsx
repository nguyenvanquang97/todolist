import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Task } from '../types/Task';
import TaskListScreen from '../screens/TaskListScreen';
import AddEditTaskScreen from '../screens/AddEditTaskScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';

// Import screens

export type RootStackParamList = {
  TaskList: undefined;
  AddEditTask: {
    task?: Task;
    mode: 'add' | 'edit';
  };
  TaskDetail: {
    task: Task;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="TaskList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{
          title: 'Danh sách công việc',
        }}
      />
      <Stack.Screen
        name="AddEditTask"
        component={AddEditTaskScreen}
        options={({ route }) => ({
          title: route.params.mode === 'add' ? 'Thêm công việc' : 'Sửa công việc',
        })}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{
          title: 'Chi tiết công việc',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;