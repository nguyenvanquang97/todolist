import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '@styles/theme';
import { useSettings } from './SettingsContext';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  colors: typeof lightTheme;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sử dụng SettingsContext để lấy và cập nhật theme
  const { settings, updateTheme } = useSettings();
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(settings.theme || 'system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(deviceTheme === 'dark' ? 'dark' : 'light');

  // Cập nhật theme dựa trên cài đặt và chế độ của thiết bị
  useEffect(() => {
    if (settings.theme === 'system') {
      setActualTheme(deviceTheme === 'dark' ? 'dark' : 'light');
    } else {
      setActualTheme(settings.theme as 'light' | 'dark');
    }
    setTheme(settings.theme);
  }, [settings.theme, deviceTheme]);

  const isDarkMode = actualTheme === 'dark';
  const colors = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    updateTheme(newTheme);
  };

  const handleSetTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    updateTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        actualTheme,
        isDarkMode,
        toggleTheme,
        setTheme: handleSetTheme,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};