import notifee, { AndroidImportance, TimestampTrigger, TriggerType } from '@notifee/react-native';
import { Task } from '../types/Task';

class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Khởi tạo kênh thông báo cho Android
   */
  public async createNotificationChannel() {
    // Chỉ cần thiết cho Android
    await notifee.createChannel({
      id: 'todo-reminders',
      name: 'Nhắc nhở công việc',
      description: 'Kênh thông báo cho các công việc sắp đến hạn',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
      lights: true,
    });
  }

  /**
   * Hiển thị thông báo ngay lập tức
   */
  public async displayNotification(title: string, body: string) {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'todo-reminders',
        smallIcon: 'ic_notification', // Cần thêm icon này vào dự án Android
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        sound: 'default',
      },
    });
  }

  /**
   * Lên lịch thông báo dựa trên ngày đến hạn của công việc
   */
  public async scheduleNotification(task: Task) {
    // Nếu không có ngày đến hạn, không lên lịch thông báo
    if (!task.due_date) return;

    // Xóa thông báo cũ nếu có (dựa trên ID task)
    if (task.id) {
      await this.cancelNotification(task.id);
    }

    const dueDate = new Date(task.due_date);
    
    // Nếu ngày đến hạn đã qua, không lên lịch thông báo
    if (dueDate.getTime() <= Date.now()) return;

    // Lên lịch thông báo trước 1 giờ
    const triggerDate = new Date(dueDate.getTime() - 60 * 60 * 1000);
    
    // Nếu thời gian thông báo đã qua, không lên lịch
    if (triggerDate.getTime() <= Date.now()) return;

    // Tạo trigger dựa trên thời gian
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
    };

    // Lên lịch thông báo
    await notifee.createTriggerNotification(
      {
        id: `task-${task.id}`,
        title: 'Nhắc nhở công việc',
        body: `Công việc "${task.title}" sẽ đến hạn trong 1 giờ nữa`,
        android: {
          channelId: 'todo-reminders',
          smallIcon: 'ic_notification',
          pressAction: {
            id: 'default',
          },
          importance: AndroidImportance.HIGH,
        },
        ios: {
          sound: 'default',
        },
      },
      trigger,
    );
  }

  /**
   * Hủy thông báo dựa trên ID task
   */
  public async cancelNotification(taskId: number) {
    await notifee.cancelNotification(`task-${taskId}`);
  }

  /**
   * Hủy tất cả thông báo
   */
  public async cancelAllNotifications() {
    await notifee.cancelAllNotifications();
  }
}

export default NotificationService;