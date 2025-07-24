import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  type?: 'warning' | 'info' | 'error' | 'success';
}

// Singleton instance for ConfirmDialog
let confirmDialogInstance: {
  show: (options: Omit<ConfirmDialogProps, 'visible'>) => void;
} | null = null;

export const ConfirmDialog = {
  show: (options: Omit<ConfirmDialogProps, 'visible'>) => {
    if (confirmDialogInstance) {
      confirmDialogInstance.show(options);
    }
  },
};

export const ConfirmDialogContainer: React.FC = () => {
  const { colors } = useTheme();
  const [dialogState, setDialogState] = React.useState<ConfirmDialogProps>({
    visible: false,
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {},
    type: 'warning',
  });

  React.useEffect(() => {
    confirmDialogInstance = {
      show: (options) => {
        // Đảm bảo dialog hiện tại đã đóng trước khi mở dialog mới
        setDialogState(prev => {
          // Luôn hiển thị dialog mới ngay lập tức, bỏ qua logic đóng dialog cũ
          return {
            ...options,
            visible: true,
          };
        });
      },
    };

    return () => {
      confirmDialogInstance = null;
    };
  }, []);

  const handleConfirm = () => {
    // Lưu tham chiếu đến hàm onConfirm hiện tại
    const { onConfirm } = dialogState;
    // Đóng dialog trước
    setDialogState((prev) => ({ ...prev, visible: false }));
    // Gọi onConfirm ngay lập tức
    if (onConfirm) onConfirm();
  };

  const handleCancel = () => {
    // Lưu tham chiếu đến hàm onCancel hiện tại
    const { onCancel } = dialogState;
    // Đóng dialog trước
    setDialogState((prev) => ({ ...prev, visible: false }));
    // Gọi onCancel ngay lập tức
    if (onCancel) {
      onCancel();
    }
  };

  const getIconName = () => {
    switch (dialogState.type) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'alert-circle';
      case 'success':
        return 'checkmark-circle';
      case 'info':
      default:
        return 'information-circle';
    }
  };

  const getIconColor = () => {
    switch (dialogState.type) {
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.danger;
      case 'success':
        return colors.success;
      case 'info':
      default:
        return colors.info;
    }
  };

  if (!dialogState.visible) {
    return null;
  }

  return (
    <Modal
      transparent
      animationType="fade"
      visible={dialogState.visible}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          <View style={styles.iconContainer}>
            <Icon name={getIconName()} size={40} color={getIconColor()} />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            {dialogState.title}
          </Text>
          
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {dialogState.message}
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
              onPress={handleCancel}
            >
              <Text style={[styles.buttonText, { color: colors.textSecondary }]}>
                {dialogState.cancelText}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, { backgroundColor: getIconColor() }]}
              onPress={handleConfirm}
            >
              <Text style={[styles.buttonText, styles.confirmButtonText]}>
                {dialogState.confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: width * 0.85,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: 'white',
  },
});