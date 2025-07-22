import { useSettings } from '@context/SettingsContext';

type TranslationKey = 
  | 'app.name'
  | 'task.title'
  | 'task.description'
  | 'task.dueDate'
  | 'task.priority'
  | 'task.status'
  | 'task.priority.low'
  | 'task.priority.medium'
  | 'task.priority.high'
  | 'task.status.pending'
  | 'task.status.completed'
  | 'task.add'
  | 'task.edit'
  | 'task.delete'
  | 'task.delete.confirm'
  | 'task.delete.cancel'
  | 'task.delete.message'
  | 'task.filter'
  | 'task.filter.all'
  | 'task.search'
  | 'task.empty'
  | 'settings.title'
  | 'settings.theme'
  | 'settings.theme.light'
  | 'settings.theme.dark'
  | 'settings.theme.system'
  | 'settings.notifications'
  | 'settings.notifications.enable'
  | 'settings.language'
  | 'settings.language.en'
  | 'settings.language.vi'
  | 'settings.data'
  | 'settings.data.reset'
  | 'settings.data.reset.confirm'
  | 'settings.data.reset.cancel'
  | 'settings.data.reset.message'
  | 'settings.info'
  | 'settings.info.version'
  | 'settings.info.lastUpdated'
  | 'settings.loading'
  | 'settings.error'
  | 'settings.retry'
  | 'common.cancel'
  | 'common.save'
  | 'common.delete'
  | 'common.edit'
  | 'common.add'
  | 'common.error'
  | 'common.success'
  | 'common.ok'
  | 'common.confirm'
  | 'common.clear'
  | 'common.updating'
  | 'common.saving'
  | 'common.notification'
  | 'priority.high'
  | 'priority.medium'
  | 'priority.low'
  | 'priority.undefined'
  | 'status.completed'
  | 'status.pending'
  | 'status.undefined'
  | 'taskList.loading'
  | 'taskList.loadError'
  | 'taskList.deleteConfirmTitle'
  | 'taskList.deleteConfirmMessage'
  | 'taskList.deleteError'
  | 'taskList.emptyList'
  | 'taskList.addTaskPrompt'
  | 'taskList.noSearchResults'
  | 'taskList.noMatchingTasks'
  | 'taskList.noFilterResults'
  | 'taskList.changeFilterPrompt'
  | 'taskList.addFirstTask'
  | 'taskDetail.deleteConfirmTitle'
  | 'taskDetail.deleteConfirmMessage'
  | 'taskDetail.deleteError'
  | 'taskDetail.updateStatusError'
  | 'taskDetail.notificationSent'
  | 'taskDetail.notificationError'
  | 'taskDetail.overdue'
  | 'taskDetail.description'
  | 'taskDetail.priority'
  | 'taskDetail.dueDate'
  | 'taskDetail.timeInfo'
  | 'taskDetail.createdAt'
  | 'taskDetail.updatedAt'
  | 'taskDetail.markComplete'
  | 'taskDetail.markIncomplete'
  | 'taskDetail.testNotification'
  | 'addEditTask.errors.emptyTitle'
  | 'addEditTask.errors.titleTooLong'
  | 'addEditTask.errors.titleTooShort'
  | 'addEditTask.errors.descriptionTooLong'
  | 'addEditTask.errors.pastDueDate'
  | 'addEditTask.updateSuccess'
  | 'addEditTask.addSuccess'
  | 'addEditTask.updateError'
  | 'addEditTask.addError'
  | 'addEditTask.saveError'
  | 'addEditTask.editTitle'
  | 'addEditTask.addTitle'
  | 'addEditTask.adding'
  | 'addEditTask.titleLabel'
  | 'addEditTask.titlePlaceholder'
  | 'addEditTask.descriptionLabel'
  | 'addEditTask.descriptionPlaceholder'
  | 'addEditTask.priorityLabel'
  | 'addEditTask.dueDateLabel'
  | 'addEditTask.selectDueDate'
  | 'addEditTask.updateButton'
  | 'addEditTask.addButton';

type Translations = {
  [key in TranslationKey]: string;
};

const en: Translations = {
  'app.name': 'Todo List',
  'task.title': 'Title',
  'task.description': 'Description',
  'task.dueDate': 'Due Date',
  'task.priority': 'Priority',
  'task.status': 'Status',
  'task.priority.low': 'Low',
  'task.priority.medium': 'Medium',
  'task.priority.high': 'High',
  'task.status.pending': 'Pending',
  'task.status.completed': 'Completed',
  'task.add': 'Add Task',
  'task.edit': 'Edit Task',
  'task.delete': 'Delete Task',
  'task.delete.confirm': 'Delete',
  'task.delete.cancel': 'Cancel',
  'task.delete.message': 'Are you sure you want to delete this task? This action cannot be undone.',
  'task.filter': 'Filter',
  'task.filter.all': 'All',
  'task.search': 'Search tasks...',
  'task.empty': 'No tasks found. Add a new task to get started!',
  'settings.title': 'Settings',
  'settings.theme': 'Theme',
  'settings.theme.light': 'Light',
  'settings.theme.dark': 'Dark',
  'settings.theme.system': 'System',
  'settings.notifications': 'Notifications',
  'settings.notifications.enable': 'Enable Notifications',
  'settings.language': 'Language',
  'settings.language.en': 'English',
  'settings.language.vi': 'Vietnamese',
  'settings.data': 'Data',
  'settings.data.reset': 'Reset Settings',
  'settings.data.reset.confirm': 'Reset',
  'settings.data.reset.cancel': 'Cancel',
  'settings.data.reset.message': 'Are you sure you want to reset all settings? This action cannot be undone.',
  'settings.info': 'Information',
  'settings.info.version': 'Version',
  'settings.info.lastUpdated': 'Last Updated',
  'settings.loading': 'Loading settings...',
  'settings.error': 'Could not load settings',
  'settings.retry': 'Retry',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.add': 'Add',
  'common.error': 'Error',
  'common.success': 'Success',
  'common.ok': 'OK',
  'common.confirm': 'Confirm',
  'common.clear': 'Clear',
  'common.updating': 'Updating...',
  'common.saving': 'Saving...',
  'common.notification': 'Notification',
  'priority.high': 'High',
  'priority.medium': 'Medium',
  'priority.low': 'Low',
  'priority.undefined': 'Undefined',
  'status.completed': 'Completed',
  'status.pending': 'Pending',
  'status.undefined': 'Undefined',
  'taskList.loading': 'Loading tasks...',
  'taskList.loadError': 'Could not load tasks. Please try again later.',
  'taskList.deleteConfirmTitle': 'Confirm Delete',
  'taskList.deleteConfirmMessage': 'Are you sure you want to delete this task?',
  'taskList.deleteError': 'Could not delete task',
  'taskList.emptyList': 'You have no tasks yet',
  'taskList.addTaskPrompt': 'Tap + to add a new task',
  'taskList.noSearchResults': 'No results found',
  'taskList.noMatchingTasks': 'No tasks match "{query}"',
  'taskList.noFilterResults': 'No matching tasks',
  'taskList.changeFilterPrompt': 'Try changing filters to see more tasks',
  'taskList.addFirstTask': 'Add your first task',
  'taskDetail.deleteConfirmTitle': 'Confirm Delete',
  'taskDetail.deleteConfirmMessage': 'Are you sure you want to delete this task?',
  'taskDetail.deleteError': 'Could not delete task',
  'taskDetail.updateStatusError': 'Could not update task status',
  'taskDetail.notificationSent': 'Test notification sent',
  'taskDetail.notificationError': 'Could not send test notification',
  'taskDetail.overdue': 'Overdue',
  'taskDetail.description': 'Description',
  'taskDetail.priority': 'Priority',
  'taskDetail.dueDate': 'Due Date',
  'taskDetail.timeInfo': 'Time Information',
  'taskDetail.createdAt': 'Created',
  'taskDetail.updatedAt': 'Updated',
  'taskDetail.markComplete': 'Mark as Complete',
  'taskDetail.markIncomplete': 'Mark as Incomplete',
  'taskDetail.testNotification': 'Test Notification',
  'addEditTask.errors.emptyTitle': 'Title cannot be empty',
  'addEditTask.errors.titleTooLong': 'Title cannot exceed 100 characters',
  'addEditTask.errors.titleTooShort': 'Title must be at least 3 characters',
  'addEditTask.errors.descriptionTooLong': 'Description cannot exceed 500 characters',
  'addEditTask.errors.pastDueDate': 'Due date must be in the future',
  'addEditTask.updateSuccess': 'Task updated successfully',
  'addEditTask.addSuccess': 'Task added successfully',
  'addEditTask.updateError': 'Could not update task. Please try again.',
  'addEditTask.addError': 'Could not add task. Please try again.',
  'addEditTask.saveError': 'Could not save task. Please try again.',
  'addEditTask.editTitle': 'Edit Task',
  'addEditTask.addTitle': 'Add New Task',
  'addEditTask.adding': 'Adding task...',
  'addEditTask.titleLabel': 'Title',
  'addEditTask.titlePlaceholder': 'Enter task title',
  'addEditTask.descriptionLabel': 'Description (optional)',
  'addEditTask.descriptionPlaceholder': 'Enter task description',
  'addEditTask.priorityLabel': 'Priority',
  'addEditTask.dueDateLabel': 'Due Date (optional)',
  'addEditTask.selectDueDate': 'Select due date',
  'addEditTask.updateButton': 'Update Task',
  'addEditTask.addButton': 'Add Task',
};

const vi: Translations = {
  'app.name': 'Danh sách việc cần làm',
  'task.title': 'Tiêu đề',
  'task.description': 'Mô tả',
  'task.dueDate': 'Hạn chót',
  'task.priority': 'Độ ưu tiên',
  'task.status': 'Trạng thái',
  'task.priority.low': 'Thấp',
  'task.priority.medium': 'Trung bình',
  'task.priority.high': 'Cao',
  'task.status.pending': 'Chưa hoàn thành',
  'task.status.completed': 'Đã hoàn thành',
  'task.add': 'Thêm công việc',
  'task.edit': 'Sửa công việc',
  'task.delete': 'Xóa công việc',
  'task.delete.confirm': 'Xóa',
  'task.delete.cancel': 'Hủy',
  'task.delete.message': 'Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác.',
  'task.filter': 'Lọc',
  'task.filter.all': 'Tất cả',
  'task.search': 'Tìm kiếm công việc...',
  'task.empty': 'Không tìm thấy công việc nào. Thêm công việc mới để bắt đầu!',
  'settings.title': 'Cài đặt',
  'settings.theme': 'Giao diện',
  'settings.theme.light': 'Sáng',
  'settings.theme.dark': 'Tối',
  'settings.theme.system': 'Hệ thống',
  'settings.notifications': 'Thông báo',
  'settings.notifications.enable': 'Bật thông báo',
  'settings.language': 'Ngôn ngữ',
  'settings.language.en': 'Tiếng Anh',
  'settings.language.vi': 'Tiếng Việt',
  'settings.data': 'Dữ liệu',
  'settings.data.reset': 'Đặt lại cài đặt',
  'settings.data.reset.confirm': 'Đặt lại',
  'settings.data.reset.cancel': 'Hủy',
  'settings.data.reset.message': 'Bạn có chắc chắn muốn đặt lại tất cả cài đặt? Hành động này không thể hoàn tác.',
  'settings.info': 'Thông tin',
  'settings.info.version': 'Phiên bản',
  'settings.info.lastUpdated': 'Cập nhật lần cuối',
  'settings.loading': 'Đang tải cài đặt...',
  'settings.error': 'Không thể tải cài đặt',
  'settings.retry': 'Thử lại',
  'common.cancel': 'Hủy',
  'common.save': 'Lưu',
  'common.delete': 'Xóa',
  'common.edit': 'Sửa',
  'common.add': 'Thêm',
  'common.error': 'Lỗi',
  'common.success': 'Thành công',
  'common.ok': 'OK',
  'common.confirm': 'Xác nhận',
  'common.clear': 'Xóa',
  'common.updating': 'Đang cập nhật...',
  'common.saving': 'Đang lưu...',
  'common.notification': 'Thông báo',
  'priority.high': 'Cao',
  'priority.medium': 'Trung bình',
  'priority.low': 'Thấp',
  'priority.undefined': 'Không xác định',
  'status.completed': 'Đã hoàn thành',
  'status.pending': 'Chưa hoàn thành',
  'status.undefined': 'Không xác định',
  'taskList.loading': 'Đang tải danh sách công việc...',
  'taskList.loadError': 'Không thể tải danh sách công việc. Vui lòng thử lại sau.',
  'taskList.deleteConfirmTitle': 'Xác nhận xóa',
  'taskList.deleteConfirmMessage': 'Bạn có chắc chắn muốn xóa công việc này?',
  'taskList.deleteError': 'Không thể xóa công việc',
  'taskList.emptyList': 'Bạn chưa có công việc nào',
  'taskList.addTaskPrompt': 'Nhấn nút + để thêm công việc mới',
  'taskList.noSearchResults': 'Không tìm thấy kết quả',
  'taskList.noMatchingTasks': 'Không có công việc nào phù hợp với "{query}"',
  'taskList.noFilterResults': 'Không có công việc nào phù hợp',
  'taskList.changeFilterPrompt': 'Thử thay đổi bộ lọc để xem nhiều công việc hơn',
  'taskList.addFirstTask': 'Thêm công việc đầu tiên',
  'taskDetail.deleteConfirmTitle': 'Xác nhận xóa',
  'taskDetail.deleteConfirmMessage': 'Bạn có chắc chắn muốn xóa công việc này?',
  'taskDetail.deleteError': 'Không thể xóa công việc',
  'taskDetail.updateStatusError': 'Không thể cập nhật trạng thái công việc',
  'taskDetail.notificationSent': 'Đã gửi thông báo kiểm tra',
  'taskDetail.notificationError': 'Không thể gửi thông báo kiểm tra',
  'taskDetail.overdue': 'Quá hạn',
  'taskDetail.description': 'Mô tả',
  'taskDetail.priority': 'Mức độ ưu tiên',
  'taskDetail.dueDate': 'Ngày đến hạn',
  'taskDetail.timeInfo': 'Thông tin thời gian',
  'taskDetail.createdAt': 'Tạo lúc',
  'taskDetail.updatedAt': 'Cập nhật',
  'taskDetail.markComplete': 'Đánh dấu hoàn thành',
  'taskDetail.markIncomplete': 'Đánh dấu chưa hoàn thành',
  'taskDetail.testNotification': 'Kiểm tra thông báo',
  'addEditTask.errors.emptyTitle': 'Tiêu đề không được để trống',
  'addEditTask.errors.titleTooLong': 'Tiêu đề không được vượt quá 100 ký tự',
  'addEditTask.errors.titleTooShort': 'Tiêu đề phải có ít nhất 3 ký tự',
  'addEditTask.errors.descriptionTooLong': 'Mô tả không được vượt quá 500 ký tự',
  'addEditTask.errors.pastDueDate': 'Ngày đến hạn không thể là ngày trong quá khứ',
  'addEditTask.updateSuccess': 'Cập nhật công việc thành công',
  'addEditTask.addSuccess': 'Thêm công việc mới thành công',
  'addEditTask.updateError': 'Không thể cập nhật công việc. Vui lòng thử lại.',
  'addEditTask.addError': 'Không thể thêm công việc mới. Vui lòng thử lại.',
  'addEditTask.saveError': 'Không thể lưu công việc. Vui lòng thử lại.',
  'addEditTask.editTitle': 'Chỉnh sửa công việc',
  'addEditTask.addTitle': 'Thêm công việc mới',
  'addEditTask.adding': 'Đang thêm công việc...',
  'addEditTask.titleLabel': 'Tiêu đề',
  'addEditTask.titlePlaceholder': 'Nhập tiêu đề công việc',
  'addEditTask.descriptionLabel': 'Mô tả',
  'addEditTask.descriptionPlaceholder': 'Nhập mô tả chi tiết về công việc',
  'addEditTask.priorityLabel': 'Mức độ ưu tiên',
  'addEditTask.dueDateLabel': 'Ngày đến hạn',
  'addEditTask.selectDueDate': 'Chọn ngày đến hạn',
  'addEditTask.updateButton': 'Cập nhật công việc',
  'addEditTask.addButton': 'Thêm công việc',
};

export const useTranslation = () => {
  const { settings } = useSettings();
  
  const t = (key: TranslationKey): string => {
    const language = settings.language || 'vi';
    return language === 'en' ? en[key] : vi[key];
  };

  return { t };
};