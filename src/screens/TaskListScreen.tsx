import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import MemoizedTaskItem from '@components/MemoizedTaskItem';
import SearchBar from '@components/SearchBar';
import FilterModal from '@components/FilterModal';
import LoadingSpinner from '@components/LoadingSpinner';
import { globalStyles } from '@styles/globalStyles';
import { spacing, borderRadius, fonts, baseColors } from '@styles/theme';
import { useTheme } from '@context/ThemeContext';
import Button from '@/components/Button';
import { useTranslation } from '@/i18n';

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
  const { t } = useTranslation();

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

  const applyCurrentFilter = useCallback(async (filter: TaskFilter) => {
    if (
      filter.status === 'all' &&
      filter.priority === 'all' &&
      !filter.searchQuery
    ) {
      await loadTasks();
    } else {
      await filterTasks(filter);
    }
  }, [loadTasks, filterTasks]);

  const handleSearch = useCallback(async (query: string) => {
    const newFilter = { ...currentFilter, searchQuery: query };
    setCurrentFilter(newFilter);
    
    if (query.trim()) {
      await searchTasks(query);
    } else {
      await applyCurrentFilter(newFilter);
    }
  }, [currentFilter, searchTasks, applyCurrentFilter]);

  const handleToggleStatus = useCallback(async (id: number, status: 'pending' | 'completed') => {
    try {
      await updateTask(id, { status });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái công việc');
    }
  }, [updateTask]);

  const handleDeleteTask = useCallback(async (id: number) => {
    try {
      await deleteTask(id);
    } catch (error) {
      Alert.alert(t('common.error'), t('taskList.deleteError'));
    }
  }, [deleteTask, t]);

  const handleTaskPress = useCallback((task: Task) => {
    navigation.navigate('TaskDetail', { task });
  }, [navigation]);

  const handleApplyFilter = useCallback(async (filter: TaskFilter) => {
    setCurrentFilter(filter);
    await applyCurrentFilter(filter);
  }, [applyCurrentFilter]);

  const renderTaskItem = useCallback(({ item }: { item: Task }) => (
    <MemoizedTaskItem
      task={item}
      onPress={() => handleTaskPress(item)}
      onToggleStatus={handleToggleStatus}
      onDelete={handleDeleteTask}
    />
  ), [handleTaskPress, handleToggleStatus, handleDeleteTask]);

  const renderEmptyState = useCallback(() => (
    <View style={[globalStyles.emptyContainer, { backgroundColor: colors.background }]}>
      <Icon name="clipboard-outline" size={64} color={colors.textDisabled} />
      <Text style={[globalStyles.emptyText, { color: colors.text }]}>
        {currentFilter.searchQuery || currentFilter.status !== 'all' || currentFilter.priority !== 'all'
          ? t('taskList.noSearchResults')
          : t('taskList.emptyList')}
      </Text>
      <Text style={[globalStyles.emptySubtext, { color: colors.textSecondary }]}>
        {currentFilter.searchQuery || currentFilter.status !== 'all' || currentFilter.priority !== 'all'
          ? t('taskList.changeFilterPrompt')
          : t('taskList.addTaskPrompt')}
      </Text>
      {(!currentFilter.searchQuery && currentFilter.status === 'all' && currentFilter.priority === 'all') && (
          <Button
            title={t('taskList.addFirstTask')}
            style={{ marginTop: spacing.lg }}
            onPress={() => navigation.navigate('AddEditTask', { mode: 'add' })}
          />
        )}
    </View>
  ), [colors, currentFilter, navigation, globalStyles, t]);

  // Memo hóa danh sách tasks để tránh render lại không cần thiết
  const memoizedTasks = useMemo(() => tasks, [tasks]);
  
  // Memo hóa keyExtractor để tránh tạo lại hàm mới mỗi khi render
  const keyExtractor = useCallback((item: Task) => item.id?.toString() || '', []);
  
  // Tính toán chiều cao của mỗi item dựa trên nội dung
  const calculateItemHeight = useCallback((item: Task): number => {
    // Chiều cao cơ bản cho mỗi item
    let height = 120;
    
    // Thêm chiều cao nếu có description
    if (item.description && item.description.length > 0) {
      // Ước tính số dòng của description (giả sử mỗi 30 ký tự là một dòng)
      const descriptionLines = Math.ceil(item.description.length / 30);
      // Mỗi dòng thêm khoảng 20px
      height += Math.min(descriptionLines, 2) * 20; // Giới hạn ở 2 dòng vì có numberOfLines={2}
    }
    
    return height;
  }, []);
  
  // Tính toán chiều cao tích lũy cho mỗi item
  const itemHeights = useMemo(() => {
    const heights: number[] = [];
    let accumHeight = 0;
    
    memoizedTasks.forEach((task) => {
      const height = calculateItemHeight(task);
      heights.push(accumHeight);
      accumHeight += height;
    });
    
    return heights;
  }, [memoizedTasks, calculateItemHeight]);
  
  // Memo hóa getItemLayout để tránh tính toán lại mỗi khi render
  const getItemLayout = useCallback((data: any, index: number) => {
    // Nếu không có dữ liệu hoặc index nằm ngoài phạm vi, sử dụng giá trị mặc định
    if (!data || index >= data.length || !itemHeights[index]) {
      return {
        length: 150,
        offset: 150 * index,
        index,
      };
    }
    
    const length = calculateItemHeight(data[index]);
    const offset = itemHeights[index];
    
    return { length, offset, index };
  }, [calculateItemHeight, itemHeights]);

  if (loading && tasks.length === 0) {
    return <LoadingSpinner text={t('taskList.loading')} />;
  }

  return (
    <View style={[globalStyles.container, { backgroundColor: colors.background }]}>
      <SearchBar
        onSearch={handleSearch}
        onClear={() => handleSearch('')}
      />
      
      <FlatList
        data={memoizedTasks}
        renderItem={renderTaskItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          globalStyles.listContainer,
          memoizedTasks.length === 0 && { flex: 1 },
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
        
        // Tối ưu hiệu suất cho danh sách lớn
        windowSize={5} // Giảm số lượng items được render cùng lúc (mặc định là 21)
        maxToRenderPerBatch={5} // Giảm số lượng items được render trong một lần (mặc định là 10)
        removeClippedSubviews={true} // Loại bỏ các view không hiển thị khỏi native view hierarchy
        initialNumToRender={5} // Giảm số lượng items được render ban đầu (mặc định là 10)
        updateCellsBatchingPeriod={50} // Thời gian chờ trước khi cập nhật batch tiếp theo (ms)
        getItemLayout={getItemLayout}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        
        // Tối ưu thêm
        disableVirtualization={false} // Đảm bảo virtualization được bật
        legacyImplementation={false} // Sử dụng implementation mới
        decelerationRate="fast" // Tốc độ giảm tốc khi cuộn
        scrollEventThrottle={16} // Tối ưu hiệu suất cuộn (60fps)
        directionalLockEnabled={true} // Chỉ cho phép cuộn theo một hướng tại một thời điểm
        showsHorizontalScrollIndicator={false}
        automaticallyAdjustContentInsets={false} // Tránh điều chỉnh content insets tự động
        
        // Tối ưu bộ nhớ
        extraData={refreshing} // Chỉ render lại khi refreshing thay đổi
        progressViewOffset={0}
        onEndReachedThreshold={0.5} // Kích hoạt onEndReached khi còn 50% danh sách
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