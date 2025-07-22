import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ToastAndroid,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTaskContext } from '../context/TaskContext';
import { Task } from '../types/Task';
import LoadingSpinner from '../components/LoadingSpinner';
import { globalStyles } from '../styles/globalStyles';
import { colors, spacing, borderRadius, fonts } from '../styles/theme';
import { testNotification } from '../utils/notificationHelper';

type TaskDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskDetail'>;
type TaskDetailScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

interface Props {
  navigation: TaskDetailScreenNavigationProp;
  route: TaskDetailScreenRouteProp;
}

const TaskDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { task: initialTask } = route.params;
  const { updateTask, deleteTask, loading } = useTaskContext();
  const [task, setTask] = useState<Task>(initialTask);

  const handleEdit = () => {
    navigation.navigate('AddEditTask', {
      mode: 'edit',
      task,
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa công việc này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(task.id!);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa công việc');
            }
          },
        },
      ]
    );
  };
  
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={handleEdit}
          >
            <Icon name="create-outline" size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={handleDelete}
          >
            <Icon name="trash-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, handleEdit, handleDelete]);

  const handleToggleStatus = async () => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateTask(task.id!, { status: newStatus });
      setTask({ ...task, status: newStatus });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái công việc');
    }
  };
  
  const handleTestNotification = async () => {
    try {
      await testNotification();
      if (Platform.OS === 'android') {
        ToastAndroid.show('Đã gửi thông báo kiểm tra', ToastAndroid.SHORT);
      } else {
        Alert.alert('Thông báo', 'Đã gửi thông báo kiểm tra');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi thông báo kiểm tra');
    }
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high':
        return { label: 'Cao', color: colors.error, icon: 'arrow-up' };
      case 'medium':
        return { label: 'Trung bình', color: colors.warning, icon: 'remove' };
      case 'low':
        return { label: 'Thấp', color: colors.success, icon: 'arrow-down' };
      default:
        return { label: 'Không xác định', color: colors.gray[500], icon: 'help' };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Đã hoàn thành', color: colors.success, icon: 'checkmark-circle' };
      case 'pending':
        return { label: 'Chưa hoàn thành', color: colors.warning, icon: 'time' };
      default:
        return { label: 'Không xác định', color: colors.gray[500], icon: 'help' };
    }
  };

  const isOverdue = task.due_date && moment(task.due_date).isBefore(moment()) && task.status === 'pending';
  const priorityInfo = getPriorityInfo(task.priority);
  const statusInfo = getStatusInfo(task.status);

  if (loading) {
    return <LoadingSpinner text="Đang cập nhật..." />;
  }

  return (
    <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
            <Icon name={statusInfo.icon} size={16} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
          {isOverdue && (
            <View style={[styles.statusBadge, { backgroundColor: colors.error + '20' }]}>
              <Icon name="warning" size={16} color={colors.error} />
              <Text style={[styles.statusText, { color: colors.error }]}>Quá hạn</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title}>{task.title}</Text>

        {/* Description */}
        {task.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        )}

        {/* Priority */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mức độ ưu tiên</Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityInfo.color + '20' }]}>
            <Icon name={priorityInfo.icon} size={20} color={priorityInfo.color} />
            <Text style={[styles.priorityText, { color: priorityInfo.color }]}>
              {priorityInfo.label}
            </Text>
          </View>
        </View>

        {/* Due Date */}
        {task.due_date && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ngày đến hạn</Text>
            <View style={styles.dateContainer}>
              <Icon name="calendar-outline" size={20} color={colors.gray[600]} />
              <Text style={[styles.dateText, isOverdue && { color: colors.error }]}>
                {moment(task.due_date).format('DD/MM/YYYY HH:mm')}
              </Text>
            </View>
            <Text style={[styles.relativeDateText, isOverdue && { color: colors.error }]}>
              {moment(task.due_date).fromNow()}
            </Text>
          </View>
        )}

        {/* Timestamps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin thời gian</Text>
          <View style={styles.timestampContainer}>
            <View style={styles.timestampRow}>
              <Icon name="add-circle-outline" size={16} color={colors.gray[500]} />
              <Text style={styles.timestampLabel}>Tạo lúc:</Text>
              <Text style={styles.timestampValue}>
                {moment(task.created_at).format('DD/MM/YYYY HH:mm')}
              </Text>
            </View>
            {task.updated_at && task.updated_at !== task.created_at && (
              <View style={styles.timestampRow}>
                <Icon name="create-outline" size={16} color={colors.gray[500]} />
                <Text style={styles.timestampLabel}>Cập nhật:</Text>
                <Text style={styles.timestampValue}>
                  {moment(task.updated_at).format('DD/MM/YYYY HH:mm')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            globalStyles.button,
            task.status === 'completed' ? globalStyles.buttonSecondary : {},
            { marginTop: spacing.xl ,flexDirection:"row", gap:8,alignItems:"center"},
          ]}
          onPress={handleToggleStatus}
        >
          <Icon
            name={task.status === 'completed' ? 'refresh' : 'checkmark'}
            size={20}
            color={task.status === 'completed' ? colors.gray[600] : colors.white}
            style={{ marginRight: spacing.xs }}
          />
          <Text
            style={[
              globalStyles.buttonText,
              task.status === 'completed' ? globalStyles.buttonSecondaryText : {},
            ]}
          >
            {task.status === 'completed' ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
          </Text>
        </TouchableOpacity>
        
        {/* Test Notification Button */}
        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.buttonSecondary,
            { marginTop: spacing.md, backgroundColor: colors.primary + '20',flexDirection:"row", gap:8,alignItems:"center"}
          ]}
          onPress={handleTestNotification}
        >
          <Icon
            name="notifications-outline"
            size={20}
            color={colors.primary}
            style={{ marginRight: spacing.xs }}
          />
          <Text
            style={[
              globalStyles.buttonText,
              { color: colors.primary }
            ]}
          >
            Kiểm tra thông báo
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  statusText: {
    fontSize: fonts.sizes.sm,
    fontWeight: '600',
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.lg,
    lineHeight: fonts.sizes.xl * 1.3,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fonts.sizes.md,
    color: colors.gray[600],
    lineHeight: fonts.sizes.md * 1.5,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  priorityText: {
    fontSize: fonts.sizes.md,
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  dateText: {
    fontSize: fonts.sizes.md,
    color: colors.gray[700],
    fontWeight: '500',
  },
  relativeDateText: {
    fontSize: fonts.sizes.sm,
    color: colors.gray[500],
    fontStyle: 'italic',
  },
  timestampContainer: {
    backgroundColor: colors.gray[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timestampLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.gray[600],
    minWidth: 70,
  },
  timestampValue: {
    fontSize: fonts.sizes.sm,
    color: colors.gray[700],
    fontWeight: '500',
  },
});

export default TaskDetailScreen;