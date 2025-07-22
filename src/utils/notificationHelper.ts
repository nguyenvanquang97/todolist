import NotificationService from '@services/NotificationService';
import { Task } from '../types/Task';

/**
 * Hàm kiểm tra và lên lịch thông báo cho tất cả các task chưa hoàn thành có ngày đến hạn
 */
export const scheduleNotificationsForTasks = async (tasks: Task[]) => {
  const notificationService = NotificationService.getInstance();

  // Lọc các task chưa hoàn thành và có ngày đến hạn
  const pendingTasksWithDueDate = tasks.filter(
    (task) => task.status === 'pending' && task.due_date
  );

  // Lên lịch thông báo cho từng task
  for (const task of pendingTasksWithDueDate) {
    await notificationService.scheduleNotification(task);
  }

  console.log(`Đã lên lịch thông báo cho ${pendingTasksWithDueDate.length} công việc`);
};

/**
 * Hàm hủy tất cả các thông báo đã lên lịch
 */
export const cancelAllScheduledNotifications = async () => {
  const notificationService = NotificationService.getInstance();
  await notificationService.cancelAllNotifications();
  console.log('Đã hủy tất cả thông báo đã lên lịch');
};

/**
 * Hàm kiểm tra thông báo bằng cách hiển thị một thông báo ngay lập tức
 */
export const testNotification = async () => {
  const notificationService = NotificationService.getInstance();
  await notificationService.displayNotification(
    'Kiểm tra thông báo',
    'Đây là thông báo kiểm tra từ ứng dụng To-Do List'
  );
  console.log('Đã gửi thông báo kiểm tra');
};
