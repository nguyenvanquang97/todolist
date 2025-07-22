import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { TaskStackParamList } from '@navigation/AppNavigator';
import { useTaskContext } from '@context/TaskContext';
import { Task, TaskFilter } from '../types/Task';
import TaskItem from '@components/TaskItem';
import SearchBar from '@components/SearchBar';
import FilterModal from '@components/FilterModal';
import LoadingSpinner from '@components/LoadingSpinner';
import { globalStyles } from '@styles/globalStyles';
import { spacing, borderRadius, fonts, baseColors } from '@styles/theme';
import { useTheme } from '@context/ThemeContext';
import Button from '@/components/Button';

type TaskListScreenNavigationProp = StackNavigationProp<TaskStackParamList, 'TaskList'>;

interface Props {
  navigation: TaskListScreenNavigationProp;
}

const TaskListScreen: React.FC<Props> = ({ navigation }) => {
  const {
    tasks,
    loading,
    error,
    loadTasks,
    updateTask,
    deleteTask,
    searchTasks,
    filterTasks,
    clearError,
  } = useTaskContext();
  
  const { colors } = useTheme();

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<TaskFilter>({
    status: 'all',
    priority: 'all',
    searchQuery: '',
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => setShowFilterModal(true)}
          >
            <Icon name="filter" size={24} color={baseColors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate('AddEditTask', { mode: 'add' })}
          >
            <Icon name="add" size={24} color={baseColors.white} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, colors]);

  useEffect(() => {
    if (error) {
      Alert.alert('Lỗi', error, [
        {
          text: 'OK',
          onPress: clearError,
        },
      ]);
    }
  }, [error, clearError]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    const newFilter = { ...currentFilter, searchQuery: query };
    setCurrentFilter(newFilter);
    
    if (query.trim()) {
      await searchTasks(query);
    } else {
      await applyCurrentFilter(newFilter);
    }
  };

  const handleToggleStatus = async (id: number, status: 'pending' | 'completed') => {
    try {
      await updateTask(id, { status });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái công việc');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa công việc');
    }
  };

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetail', { task });
  };

  const applyCurrentFilter = async (filter: TaskFilter) => {
    if (
      filter.status === 'all' &&
      filter.priority === 'all' &&
      !filter.searchQuery
    ) {
      await loadTasks();
    } else {
      await filterTasks(filter);
    }
  };

  const handleApplyFilter = async (filter: TaskFilter) => {
    setCurrentFilter(filter);
    await applyCurrentFilter(filter);
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onPress={() => handleTaskPress(item)}
      onToggleStatus={handleToggleStatus}
      onDelete={handleDeleteTask}
    />
  );

  const renderEmptyState = () => (
    <View style={[globalStyles.emptyContainer, { backgroundColor: colors.background }]}>
      <Icon name="clipboard-outline" size={64} color={colors.textDisabled} />
      <Text style={[globalStyles.emptyText, { color: colors.text }]}>
        {currentFilter.searchQuery || currentFilter.status !== 'all' || currentFilter.priority !== 'all'
          ? 'Không tìm thấy công việc nào'
          : 'Chưa có công việc nào'}
      </Text>
      <Text style={[globalStyles.emptySubtext, { color: colors.textSecondary }]}>
        {currentFilter.searchQuery || currentFilter.status !== 'all' || currentFilter.priority !== 'all'
          ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
          : 'Nhấn nút + để thêm công việc mới'}
      </Text>
      {(!currentFilter.searchQuery && currentFilter.status === 'all' && currentFilter.priority === 'all') && (
          <Button
            title="Thêm công việc đầu tiên"
            style={{ marginTop: spacing.lg }}
            onPress={() => navigation.navigate('AddEditTask', { mode: 'add' })}
          />
        )}
    </View>
  );

  if (loading && tasks.length === 0) {
    return <LoadingSpinner text="Đang tải danh sách công việc..." />;
  }

  return (
    <View style={[globalStyles.container, { backgroundColor: colors.background }]}>
      <SearchBar
        onSearch={handleSearch}
        onClear={() => handleSearch('')}
      />
      
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id?.toString() || ''}
        contentContainerStyle={[
          globalStyles.listContainer,
          tasks.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <FilterModal
        visible={showFilterModal}
        currentFilter={currentFilter}
        onClose={() => setShowFilterModal(false)}
        onApplyFilter={handleApplyFilter}
      />
    </View>
  );
};

export default TaskListScreen;