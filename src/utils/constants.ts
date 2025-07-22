// Database constants
export const DATABASE_NAME = 'TodoApp.db';
export const DATABASE_VERSION = '1.0';
export const DATABASE_DISPLAY_NAME = 'Todo App Database';
export const DATABASE_SIZE = 200000;

// Table names
export const TABLES = {
  TASKS: 'tasks',
} as const;

// Task priorities
export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const PRIORITY_LABELS = {
  [TASK_PRIORITIES.LOW]: 'Thấp',
  [TASK_PRIORITIES.MEDIUM]: 'Trung bình',
  [TASK_PRIORITIES.HIGH]: 'Cao',
} as const;

// Task statuses
export const TASK_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const;

export const STATUS_LABELS = {
  [TASK_STATUSES.PENDING]: 'Chưa hoàn thành',
  [TASK_STATUSES.COMPLETED]: 'Đã hoàn thành',
} as const;

// Filter options
export const FILTER_OPTIONS = {
  ALL: 'all',
  PENDING: 'pending',
  COMPLETED: 'completed',
  HIGH_PRIORITY: 'high',
  MEDIUM_PRIORITY: 'medium',
  LOW_PRIORITY: 'low',
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  DATABASE: 'YYYY-MM-DD HH:mm:ss',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
} as const;

// Validation limits
export const VALIDATION_LIMITS = {
  TASK_TITLE_MIN: 3,
  TASK_TITLE_MAX: 100,
  TASK_DESCRIPTION_MAX: 500,
  SEARCH_QUERY_MAX: 100,
} as const;

// UI constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  REFRESH_THRESHOLD: 50,
  MAX_VISIBLE_TASKS: 100,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng',
  DATABASE_ERROR: 'Lỗi cơ sở dữ liệu',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  UNKNOWN_ERROR: 'Đã xảy ra lỗi không xác định',
  TASK_NOT_FOUND: 'Không tìm thấy công việc',
  PERMISSION_DENIED: 'Không có quyền truy cập',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Công việc đã được tạo thành công',
  TASK_UPDATED: 'Công việc đã được cập nhật thành công',
  TASK_DELETED: 'Công việc đã được xóa thành công',
  TASK_COMPLETED: 'Công việc đã được đánh dấu hoàn thành',
  TASK_REOPENED: 'Công việc đã được mở lại',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  LAST_SYNC: 'last_sync',
  APP_VERSION: 'app_version',
} as const;

// App configuration
export const APP_CONFIG = {
  VERSION: '1.0.0',
  BUILD_NUMBER: 1,
  MIN_ANDROID_VERSION: 21,
  MIN_IOS_VERSION: '12.0',
} as const;

// Navigation routes
export const ROUTES = {
  TASK_LIST: 'TaskList',
  ADD_EDIT_TASK: 'AddEditTask',
  TASK_DETAIL: 'TaskDetail',
} as const;

// Icon names
export const ICONS = {
  ADD: 'add',
  EDIT: 'create-outline',
  DELETE: 'trash-outline',
  SEARCH: 'search',
  FILTER: 'filter',
  CALENDAR: 'calendar-outline',
  CHECKMARK: 'checkmark',
  CLOSE: 'close',
  ARROW_UP: 'arrow-up',
  ARROW_DOWN: 'arrow-down',
  REMOVE: 'remove',
  TIME: 'time',
  WARNING: 'warning',
  CHECKMARK_CIRCLE: 'checkmark-circle',
  CLIPBOARD: 'clipboard-outline',
  REFRESH: 'refresh',
} as const;

// Regex patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[0-9]{10,15}$/,
  HARMFUL_CHARS: /[<>"'&]/,
  WHITESPACE: /\s+/g,
} as const;

// Default values
export const DEFAULT_VALUES = {
  TASK_PRIORITY: TASK_PRIORITIES.MEDIUM,
  TASK_STATUS: TASK_STATUSES.PENDING,
  SEARCH_QUERY: '',
  FILTER_STATUS: FILTER_OPTIONS.ALL,
  FILTER_PRIORITY: FILTER_OPTIONS.ALL,
} as const;