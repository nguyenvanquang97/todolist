import { Task } from '../types/Task';
import { validateDate } from './dateUtils';

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export const validateTask = (task: Partial<Task>): ValidationResult => {
  const errors: { [key: string]: string } = {};

  // Validate title
  if (!task.title || !task.title.trim()) {
    errors.title = 'Tiêu đề không được để trống';
  } else if (task.title.trim().length < 3) {
    errors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
  } else if (task.title.trim().length > 100) {
    errors.title = 'Tiêu đề không được vượt quá 100 ký tự';
  }

  // Validate description
  if (task.description && task.description.length > 500) {
    errors.description = 'Mô tả không được vượt quá 500 ký tự';
  }

  // Validate priority
  if (task.priority && !['low', 'medium', 'high'].includes(task.priority)) {
    errors.priority = 'Mức độ ưu tiên không hợp lệ';
  }

  // Validate status
  if (task.status && !['pending', 'completed'].includes(task.status)) {
    errors.status = 'Trạng thái không hợp lệ';
  }

  // Validate due date
  if (task.due_date) {
    if (!validateDate(task.due_date)) {
      errors.due_date = 'Ngày đến hạn không hợp lệ';
    } else {
      const dueDate = new Date(task.due_date);
      const now = new Date();
      if (dueDate < now) {
        errors.due_date = 'Ngày đến hạn không thể là ngày trong quá khứ';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSearchQuery = (query: string): ValidationResult => {
  const errors: { [key: string]: string } = {};

  if (query.length > 100) {
    errors.query = 'Từ khóa tìm kiếm không được vượt quá 100 ký tự';
  }

  // Check for potentially harmful characters
  const harmfulChars = /[<>"'&]/;
  if (harmfulChars.test(query)) {
    errors.query = 'Từ khóa tìm kiếm chứa ký tự không hợp lệ';
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
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} là bắt buộc`;
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value && value.length < minLength) {
    return `${fieldName} phải có ít nhất ${minLength} ký tự`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value && value.length > maxLength) {
    return `${fieldName} không được vượt quá ${maxLength} ký tự`;
  }
  return null;
};

export const validateRange = (value: number, min: number, max: number, fieldName: string): string | null => {
  if (value < min || value > max) {
    return `${fieldName} phải nằm trong khoảng ${min} - ${max}`;
  }
  return null;
};