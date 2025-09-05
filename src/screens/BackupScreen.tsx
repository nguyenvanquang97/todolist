import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import {Toast} from '@components/Toast';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@context/ThemeContext';
import {useTaskContext} from '@context/TaskContext';
import {useSettings} from '@context/SettingsContext';
import {spacing, borderRadius, fonts, baseColors} from '@styles/theme';
import {useTranslation} from '@i18n/index';
import {NavigationService} from '@navigation/index';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import DatabaseHelper from '@/database/DatabaseHelper';
import {ExportData} from '@/types/Task';

const BackupScreen: React.FC = () => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [exportPath, setExportPath] = useState<string | null>(null);
  const {loadTasks} = useTaskContext();
  const {loadSettings} = useSettings();

  const dbHelper = DatabaseHelper.getInstance();

  const handleExportData = async () => {
    try {
      setLoading(true);

      // Lấy dữ liệu từ database
      const exportData = await dbHelper.exportData();

      if (!exportData) {
        throw new Error('Failed to export data from database');
      }

      // Tạo tên file với timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `todoapp_backup_${timestamp}.json`;

      // Đường dẫn lưu file
      let path;
      try {
        path =
          Platform.OS === 'ios'
            ? `${RNFS.DocumentDirectoryPath}/${fileName}`
            : `${RNFS.DownloadDirectoryPath}/${fileName}`;
      } catch (pathError) {
        console.error('Path error:', pathError);
        throw new Error('Failed to determine file path');
      }

      // Chuyển đổi dữ liệu thành JSON string
      const jsonData = JSON.stringify(exportData, null, 2);
   
      // Ghi file
      await RNFS.writeFile(path, jsonData, 'utf8');

      setExportPath(path);
      Toast.show(t('backup.exportSuccess'), 'success');
    } catch (error) {
      console.error('Export error:', error);
      Toast.show(t('backup.exportError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = async () => {
    try {
      setLoading(true);

      // Xác định thư mục đã lưu file export
      const exportDirectory = Platform.OS === 'ios'
        ? RNFS.DocumentDirectoryPath
        : RNFS.DownloadDirectoryPath;

      // Hiển thị thông báo cho người dùng về vị trí file export
      if (exportPath) {
        Toast.show(t('backup.findExportAt') + ': ' + exportPath, 'info');
      } else {
        // Nếu chưa có exportPath, thông báo cho người dùng về thư mục mặc định
        Toast.show(t('backup.lookInDirectory') + ': ' + exportDirectory, 'info');
      }

      // Mở document picker để chọn file
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        // Trên Android, có thể chỉ định thư mục ban đầu (không hoạt động trên iOS)
        copyTo: Platform.OS === 'android' ? 'cachesDirectory' : undefined,
        presentationStyle: 'fullScreen',
      });

      // Kiểm tra nếu người dùng đã hủy việc chọn file
      if (!result || result.length === 0) {
        setLoading(false);
        return;
      }
      
      console.log('Selected file:', result[0].uri);

      // Đọc nội dung file
      let fileContent;
      try {
        fileContent = await RNFS.readFile(result[0].uri, 'utf8');
        console.log('File content:', fileContent);
      } catch (readError) {
        console.error('File read error:', readError);
        Toast.show(t('backup.importError'), 'error');
        setLoading(false);
        return;
      }

      // Parse JSON
      let importData;
      try {
        importData = JSON.parse(fileContent) as ExportData;
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        Toast.show(t('backup.invalidFileFormat'), 'error');
        setLoading(false);
        return;
      }

      // Kiểm tra cấu trúc dữ liệu
      if (
        !importData.tasks ||
        !Array.isArray(importData.tasks) ||
        !importData.categories ||
        !Array.isArray(importData.categories) ||
        !importData.tags ||
        !Array.isArray(importData.tags) ||
        !importData.task_tags ||
        !Array.isArray(importData.task_tags) ||
        !importData.projects ||
        !Array.isArray(importData.projects) ||
        !importData.settings ||
        typeof importData.settings !== 'object' ||
        !importData.version ||
        typeof importData.version !== 'string' ||
        !importData.export_date ||
        typeof importData.export_date !== 'string'
      ) {
        console.error(
          'Invalid import data structure:',
          JSON.stringify(importData),
        );
        Toast.show(t('backup.invalidFileFormat'), 'error');
        setLoading(false);
        return;
      }

      // Hiển thị dialog xác nhận
      Alert.alert(
        t('backup.importConfirmTitle'),
        t('backup.importConfirmMessage'),
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
          {
            text: t('common.confirm'),
            onPress: async () => {
              try {
                // Import dữ liệu vào database
                await dbHelper.importData(importData);
                Toast.show(t('backup.importSuccess'), 'success');
                
                // Tải lại danh sách công việc và cài đặt
                await loadTasks();
                await loadSettings();
                
                // Chuyển về màn hình danh sách công việc thông qua BottomTabNavigator
                NavigationService.navigate('BottomTabNavigator', { screen: 'TaskList' });
              } catch (error) {
                console.error('Import error:', error);
                Toast.show(t('backup.importError'), 'error');
              } finally {
                setLoading(false);
              }
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error('Import selection error:', error);
      Toast.show(t('backup.importError'), 'error');
      setLoading(false);
    }
  };

  const handleShareExport = async () => {
    try {
      if (!exportPath) {
        Toast.show(t('backup.noExportFile'), 'info');
        return;
      }

      // Kiểm tra xem file có tồn tại không
      const exists = await RNFS.exists(exportPath);
      if (!exists) {
        Toast.show(t('backup.exportError'), 'error');
        return;
      }

      // Ở đây sẽ thêm code để chia sẻ file
      // Cần thêm thư viện react-native-share
      Toast.show(t('backup.shareNotImplemented'), 'info');
    } catch (error) {
      console.error('Share error:', error);
      Toast.show(t('backup.exportError'), 'error');
    }
  };

  const styles = createStyles(colors);

  if (loading) {
    return (
      <View
        style={[styles.loadingContainer, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, {color: colors.text}]}>
          {t('backup.loading')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.textSecondary}]}>
          {t('backup.export')}
        </Text>
        <View style={styles.infoBox}>
          <Icon
            name="information-circle-outline"
            size={20}
            color={colors.info}
          />
          <Text style={[styles.infoText, {color: colors.text}]}>
            {t('backup.exportInfo')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: colors.primary}]}
          onPress={handleExportData}>
          <Icon name="download-outline" size={20} color={baseColors.white} />
          <Text style={styles.actionButtonText}>
            {t('backup.exportButton')}
          </Text>
        </TouchableOpacity>

        {exportPath && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              {backgroundColor: colors.secondary, marginTop: spacing.md},
            ]}
            onPress={handleShareExport}>
            <Icon
              name="share-social-outline"
              size={20}
              color={baseColors.white}
            />
            <Text style={styles.actionButtonText}>
              {t('backup.shareButton')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.textSecondary}]}>
          {t('backup.import')}
        </Text>
        <View style={styles.infoBox}>
          <Icon name="warning-outline" size={20} color={colors.warning} />
          <Text style={[styles.infoText, {color: colors.text}]}>
            {t('backup.importWarning')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: colors.secondary}]}
          onPress={handleImportData}>
          <Icon
            name="cloud-upload-outline"
            size={20}
            color={baseColors.white}
          />
          <Text style={styles.actionButtonText}>
            {t('backup.importButton')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      overflow: 'hidden',
    },
    sectionTitle: {
      fontSize: fonts.sizes.lg,
      fontWeight: '600',
      marginBottom: spacing.md,
    },
    infoBox: {
      flexDirection: 'row',
      backgroundColor: `${colors.info}20`,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginBottom: spacing.lg,
      alignItems: 'flex-start',
      gap: spacing.sm,
    },
    infoText: {
      fontSize: fonts.sizes.sm,
      flex: 1,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.md,
      borderRadius: borderRadius.md,
      gap: spacing.sm,
    },
    actionButtonText: {
      color: baseColors.white,
      fontSize: fonts.sizes.md,
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    loadingText: {
      marginTop: spacing.md,
      fontSize: fonts.sizes.md,
    },
  });

export default BackupScreen;
