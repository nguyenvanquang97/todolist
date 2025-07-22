import moment from 'moment';

// Khởi tạo mặc định với tiếng Việt
moment.locale('vi');

// Cấu hình moment dựa trên ngôn ngữ hiện tại
export const configureMomentLocale = (language: string = 'vi') => {
  moment.locale(language);
};

export const formatDate = (date: string | Date, format: string = 'DD/MM/YYYY'): string => {
  return moment(date).format(format);
};

export const formatDateTime = (date: string | Date): string => {
  return moment(date).format('DD/MM/YYYY HH:mm');
};

export const formatRelativeTime = (date: string | Date): string => {
  return moment(date).fromNow();
};

export const isOverdue = (dueDate: string | Date): boolean => {
  return moment(dueDate).isBefore(moment());
};

export const getDaysUntilDue = (dueDate: string | Date): number => {
  return moment(dueDate).diff(moment(), 'days');
};

export const isToday = (date: string | Date): boolean => {
  return moment(date).isSame(moment(), 'day');
};

export const isTomorrow = (date: string | Date): boolean => {
  return moment(date).isSame(moment().add(1, 'day'), 'day');
};

export const isThisWeek = (date: string | Date): boolean => {
  return moment(date).isSame(moment(), 'week');
};

export const getDateRangeText = (date: string | Date, translations?: { today: string; tomorrow: string; yesterday: string }): string => {
  const momentDate = moment(date);
  const now = moment();

  if (momentDate.isSame(now, 'day')) {
    return translations?.today || 'Hôm nay';
  }

  if (momentDate.isSame(now.add(1, 'day'), 'day')) {
    return translations?.tomorrow || 'Ngày mai';
  }

  if (momentDate.isSame(now.subtract(1, 'day'), 'day')) {
    return translations?.yesterday || 'Hôm qua';
  }

  if (momentDate.isSame(now, 'week')) {
    return momentDate.format('dddd');
  }

  if (momentDate.isSame(now, 'year')) {
    return momentDate.format('DD/MM');
  }

  return momentDate.format('DD/MM/YYYY');
};

export const validateDate = (date: string | Date): boolean => {
  return moment(date).isValid();
};

export const createDateFromString = (dateString: string): Date | null => {
  const momentDate = moment(dateString);
  return momentDate.isValid() ? momentDate.toDate() : null;
};

export const getCurrentTimestamp = (): string => {
  return moment().format('YYYY-MM-DD HH:mm:ss');
};

export const addDays = (date: string | Date, days: number): string => {
  return moment(date).add(days, 'days').format('YYYY-MM-DD HH:mm:ss');
};

export const subtractDays = (date: string | Date, days: number): string => {
  return moment(date).subtract(days, 'days').format('YYYY-MM-DD HH:mm:ss');
};
