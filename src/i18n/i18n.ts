import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { TranslationKey } from './types';
import en from './en';
import vi from './vi';

export const useTranslation = () => {
  const context = useContext(SettingsContext);

  const t = (key: TranslationKey): string => {
    // Nếu context không tồn tại, sử dụng ngôn ngữ mặc định là tiếng Việt
    const language = context?.settings?.language || 'vi';
    return language === 'en' ? en[key] : vi[key];
  };

  return { t };
};
