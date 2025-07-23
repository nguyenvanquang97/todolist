import React, {useRef, useEffect} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {spacing, borderRadius, baseColors} from '@styles/theme';
import {useTheme} from '@context/ThemeContext';
import {useTranslation} from '@i18n/i18n';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  value?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onSearch,
  onClear,
  value = '',
}) => {
  const {colors, isDarkMode} = useTheme();
  const {t} = useTranslation();
  const inputRef = useRef<TextInput>(null);

  // Use the provided placeholder or default to translated value
  const searchPlaceholder = placeholder || t('taskList.searchPlaceholder');

  const handleSearch = (text: string) => {
    onSearch(text);
  };

  const handleClear = () => {
    onSearch('');
    onClear?.();
    // Giữ focus sau khi xóa
    inputRef.current?.focus();
  };

  const handleSubmitEditing = () => {
    // Giữ focus sau khi nhấn Enter/Return
    inputRef.current?.focus();
  };

  // Giữ focus khi value thay đổi, đặc biệt khi không có kết quả tìm kiếm
  useEffect(() => {
    if (value && value.length > 0) {
      inputRef.current?.focus();
    }
  }, [value]);

  // Tự động focus khi component mount
  useEffect(() => {
    // Đợi một chút để đảm bảo component đã render hoàn toàn
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          {backgroundColor: isDarkMode ? colors.surface : baseColors.gray[100]},
        ]}>
        <Icon
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          ref={inputRef}
          style={[styles.input, {color: colors.text}]}
          placeholder={searchPlaceholder}
          placeholderTextColor={colors.textDisabled}
          value={value}
          onChangeText={handleSearch}
          returnKeyType="search"
          onSubmitEditing={handleSubmitEditing}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Icon name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: 16,
  },
  clearButton: {
    padding: spacing.xs,
  },
});

export default SearchBar;
