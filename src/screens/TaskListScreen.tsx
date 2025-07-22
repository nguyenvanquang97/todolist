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
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTaskContext } from '../context/TaskContext';
import { Task, TaskFilter } from '../types/Task';
import TaskItem from '../components/TaskItem';
import SearchBar from '../components/SearchBar';
import FilterModal from '../components/FilterModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { globalStyles } from '../styles/globalStyles';
import { colors, spacing } from '../styles/theme';

type TaskListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskList'>;

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
            <Icon name="filter" size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate('AddEditTask', { mode: 'add' })}
          >
            <Icon name="add" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

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
    <View style={globalStyles.emptyContainer}>
      <Icon name="clipboard-outline" size={64} color={colors.gray[400]} />
      <Text style={globalStyles.emptyText}>
        {currentFilter.searchQuery || currentFilter.status !== 'all' || currentFilter.priority !== 'all'
          ? 'Không tìm thấy công việc nào'
          : 'Chưa có công việc nào'}
      </Text>
      <Text style={globalStyles.emptySubtext}>
        {currentFilter.searchQuery || currentFilter.status !== 'all' || currentFilter.priority !== 'all'
          ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
          : 'Nhấn nút + để thêm công việc mới'}
      </Text>
      {(!currentFilter.searchQuery && currentFilter.status === 'all' && currentFilter.priority === 'all') && (
        <TouchableOpacity
          style={[globalStyles.button, { marginTop: spacing.lg }]}
          onPress={() => navigation.navigate('AddEditTask', { mode: 'add' })}
        >
          <Text style={globalStyles.buttonText}>Thêm công việc đầu tiên</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && tasks.length === 0) {
    return <LoadingSpinner text="Đang tải danh sách công việc..." />;
  }

  return (
    <View style={globalStyles.container}>
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