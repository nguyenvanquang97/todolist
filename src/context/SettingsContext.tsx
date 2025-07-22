import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import DatabaseHelper from '@database/DatabaseHelper';
import { AppSettings } from '../types/Task';

type ThemeType = 'light' | 'dark' | 'system';

interface SettingsContextType {
  settings: AppSettings;
  loading: boolean;
  error: string | null;
  updateTheme: (theme: ThemeType) => Promise<void>;
  updateNotifications: (enabled: boolean) => Promise<void>;
  updateLanguage: (language: 'en' | 'vi') => Promise<void>;
  resetSettings: () => Promise<void>;
  clearError: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  notifications_enabled: true,
  language: 'vi',
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const dbHelper = DatabaseHelper.getInstance();

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      await dbHelper.initDatabase();
      const savedSettings = await dbHelper.getSettings();
      setSettings(savedSettings);
      setError(null);
    } catch (error: any) {
      console.error('Error loading settings:', error);
      setError('Error loading settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [dbHelper]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateTheme = async (theme: ThemeType) => {
    try {
      setLoading(true);
      await dbHelper.updateSettings({ theme });
      setSettings(prev => ({ ...prev, theme }));
      setError(null);
    } catch (error: any) {
      console.error('Error updating theme:', error);
      setError('Error updating theme: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateNotifications = async (enabled: boolean) => {
    try {
      setLoading(true);
      await dbHelper.updateSettings({ notifications_enabled: enabled });
      setSettings(prev => ({ ...prev, notifications_enabled: enabled }));
      setError(null);
    } catch (error: any) {
      console.error('Error updating notifications:', error);
      setError('Error updating notifications: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateLanguage = async (language: 'en' | 'vi') => {
    try {
      setLoading(true);
      await dbHelper.updateSettings({ language });
      setSettings(prev => ({ ...prev, language }));
      setError(null);
    } catch (error: any) {
      console.error('Error updating language:', error);
      setError('Error updating language: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = async () => {
    try {
      setLoading(true);
      await dbHelper.updateSettings(defaultSettings);
      setSettings(defaultSettings);
      setError(null);
    } catch (error: any) {
      console.error('Error resetting settings:', error);
      setError('Error resetting settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        updateTheme,
        updateNotifications,
        updateLanguage,
        resetSettings,
        clearError,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
