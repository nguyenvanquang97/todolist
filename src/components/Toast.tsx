import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Platform,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: 'top' | 'bottom';
}

interface ToastState extends ToastProps {
  visible: boolean;
}

// Singleton instance for Toast
let toastInstance: {
  show: (message: string, type?: ToastType, duration?: number, position?: 'top' | 'bottom') => void;
} | null = null;

export const Toast = {
  show: (message: string, type: ToastType = 'info', duration: number = 3000, position: 'top' | 'bottom' = 'bottom') => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      return;
    }

    if (toastInstance) {
      toastInstance.show(message, type, duration, position);
    }
  },
};

const ToastContainer: React.FC = () => {
  const { colors } = useTheme();
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
    duration: 3000,
    position: 'bottom',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    toastInstance = {
      show: (message, type = 'info', duration = 3000, position = 'bottom') => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        setToast({
          visible: true,
          message,
          type,
          duration,
          position,
        });

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        timeoutRef.current = setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setToast(prev => ({ ...prev, visible: false }));
          });
        }, duration);
      },
    };

    return () => {
      toastInstance = null;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fadeAnim]);

  if (!toast.visible) {
    return null;
  }

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return colors.success || '#4CAF50';
      case 'error':
        return colors.danger || '#F44336';
      case 'warning':
        return colors.warning || '#FF9800';
      case 'info':
      default:
        return colors.primary || '#2196F3';
    }
  };

  const positionStyle = toast.position === 'top' 
    ? { top: 60 } 
    : { bottom: 60 };

  return (
    <Animated.View
      style={[
        styles.container,
        positionStyle,
        { opacity: fadeAnim, backgroundColor: getBackgroundColor() },
      ]}
    >
      <Text style={styles.text}>{toast.message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ToastContainer;