import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { TranslationKey } from './types';
import en from './en';
import vi from './vi';

export const useTranslation = () => {
  const context = useContext(SettingsContext);

  const t = (key: TranslationKey, options?: Record<string, any>): string => {
    // Nếu context không tồn tại, sử dụng ngôn ngữ mặc định là tiếng Việt
    const language = context?.settings?.language || 'vi';
    let text = language === 'en' ? en[key] : vi[key];
    
    // Xử lý các tham số thay thế
    if (options) {
      Object.keys(options).forEach(optionKey => {
        text = text.replace(new RegExp(`\\{${optionKey}\\}`, 'g'), options[optionKey]);
      });
    }
    
    return text;
  };

  return { t };
};
