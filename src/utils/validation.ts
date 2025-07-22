import { Task } from '../types/Task';
import { validateDate } from './dateUtils';

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export const validateTask = (task: Partial<Task>, translations?: {
  emptyTitle: string;
  titleTooShort: string;
  titleTooLong: string;
  descriptionTooLong: string;
  pastDueDate: string;
  commonError: string;
}): ValidationResult => {
  const errors: { [key: string]: string } = {};
  const defaultTranslations = {
    emptyTitle: 'Tiêu đề không được để trống',
    titleTooShort: 'Tiêu đề quá ngắn (tối thiểu 3 ký tự)',
    titleTooLong: 'Tiêu đề quá dài (tối đa 100 ký tự)',
    descriptionTooLong: 'Mô tả quá dài (tối đa 500 ký tự)',
    pastDueDate: 'Ngày đến hạn không thể trong quá khứ',
    commonError: 'Lỗi',
  };
  const t = translations || defaultTranslations;

  // Validate title
  if (!task.title || !task.title.trim()) {
    errors.title = t.emptyTitle;
  } else if (task.title.trim().length < 3) {
    errors.title = t.titleTooShort;
  } else if (task.title.trim().length > 100) {
    errors.title = t.titleTooLong;
  }

  // Validate description
  if (task.description && task.description.length > 500) {
    errors.description = t.descriptionTooLong;
  }

  // Validate priority
  if (task.priority && !['low', 'medium', 'high'].includes(task.priority)) {
    errors.priority = t.commonError;
  }

  // Validate status
  if (task.status && !['pending', 'completed'].includes(task.status)) {
    errors.status = t.commonError;
  }

  // Validate due date
  if (task.due_date) {
    if (!validateDate(task.due_date)) {
      errors.due_date = t.commonError;
    } else {
      const dueDate = new Date(task.due_date);
      const now = new Date();
      if (dueDate < now) {
        errors.due_date = t.pastDueDate;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSearchQuery = (query: string, errorMessage: string = 'Lỗi'): ValidationResult => {
  const errors: { [key: string]: string } = {};

  if (query.length > 100) {
    errors.query = errorMessage;
  }

  // Check for potentially harmful characters
  const harmfulChars = /[<>"'&]/;
  if (harmfulChars.test(query)) {
    errors.query = errorMessage;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>"'&]/g, '') // Remove potentially harmful characters
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[+]?[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return !!parsedUrl;
  } catch {
    return false;
  }
};

export const validateRequired = (value: any, fieldName: string, errorMessage: string = 'Trường này là bắt buộc'): string | null => {
  if (value === null || value === undefined || value === '') {
    return errorMessage;
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string, errorMessage: string = `Độ dài tối thiểu là ${minLength} ký tự`): string | null => {
  if (value && value.length < minLength) {
    return errorMessage;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string, errorMessage: string = `Độ dài tối đa là ${maxLength} ký tự`): string | null => {
  if (value && value.length > maxLength) {
    return errorMessage;
  }
  return null;
};

export const validateRange = (value: number, min: number, max: number, fieldName: string, errorMessage: string = `Giá trị phải nằm trong khoảng từ ${min} đến ${max}`): string | null => {
  if (value < min || value > max) {
    return errorMessage;
  }
  return null;
};
