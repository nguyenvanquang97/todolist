import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { spacing, borderRadius, baseColors } from '@styles/theme';
import { useTheme } from '@context/ThemeContext';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Tìm kiếm công việc...',
  onSearch,
  onClear,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { colors, isDarkMode } = useTheme();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
    onClear?.();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? colors.surface : baseColors.gray[100] }]}>
        <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textDisabled}
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
          onSubmitEditing={() => onSearch(searchQuery)}
        />
        {searchQuery.length > 0 && (
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