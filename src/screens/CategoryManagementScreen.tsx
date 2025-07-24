import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useTaskContext } from '../context/TaskContext';
import { Category } from '../types/Task';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ColorPicker from '../components/ColorPicker';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n/i18n';

const CategoryManagementScreen: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, loading } = useTaskContext();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3498db');
  const [icon, setIcon] = useState('folder');

  const resetForm = () => {
    setName('');
    setColor('#3498db');
    setIcon('folder');
    setEditingCategory(null);
    setIsAddMode(false);
  };

  const handleAddCategory = () => {
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('common.errors.validation'));
      return;
    }

    addCategory({
      name: name.trim(),
      color,
      icon,
    }).then(() => {
      resetForm();
    });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || editingCategory.id === undefined) return;
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('common.errors.validation'));
      return;
    }

    updateCategory(editingCategory.id, {
      name: name.trim(),
      color,
      icon,
    }).then(() => {
      resetForm();
    });
  };

  const handleDeleteCategory = (id: number) => {
    Alert.alert(
      t('common.confirm'),
      t('taskDetail.deleteConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            deleteCategory(id).then(() => {
              resetForm();
            });
          },
        },
      ]
    );
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setColor(category.color);
    setIcon(category.icon || 'folder');
    setIsAddMode(false);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => {
    const isEditing = editingCategory?.id === item.id;

    return (
      <View style={[styles.categoryItem, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
        <View style={[styles.categoryColor, { backgroundColor: item.color }]} />
        <Icon name={item.icon || 'folder'} size={24} color={item.color} style={styles.categoryIcon} />
        <Text style={[styles.categoryName, { color: theme === 'dark' ? '#fff' : '#000' }]}>{item.name}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => startEditing(item)} style={styles.actionButton}>
            <Icon name="edit" size={20} color={theme === 'dark' ? '#ccc' : '#666'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => item.id !== undefined && handleDeleteCategory(item.id)} style={styles.actionButton}>
            <Icon name="delete" size={20} color={theme === 'dark' ? '#ccc' : '#666'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5' }]}>
      <View style={[styles.formContainer, { backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff' }]}>
        <Text style={[styles.formTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>
          {isAddMode ? t('common.add') : editingCategory ? t('common.edit') : t('settings.categories')}
        </Text>

        {(isAddMode || editingCategory) && (
          <>
            <TextInput
              style={[styles.input, { backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5', color: theme === 'dark' ? '#fff' : '#000' }]}
              placeholder={t('task.title')}
              placeholderTextColor={theme === 'dark' ? '#aaa' : '#999'}
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>{t('task.priority')}:</Text>
            <ColorPicker selectedColor={color} onSelectColor={setColor} />

            <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>{t('common.add')}:</Text>
            <View style={styles.iconSelector}>
              {['folder', 'work', 'home', 'shopping-cart', 'school', 'fitness-center', 'local-grocery-store', 'directions-car', 'flight', 'restaurant'].map((iconName) => (
                <TouchableOpacity
                  key={iconName}
                  style={[styles.iconOption, icon === iconName && { backgroundColor: color + '40' }]}
                  onPress={() => setIcon(iconName)}
                >
                  <Icon name={iconName} size={24} color={icon === iconName ? color : theme === 'dark' ? '#ccc' : '#666'} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0' }]}
                onPress={resetForm}
              >
                <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton, { backgroundColor: color }]}
                onPress={editingCategory ? handleUpdateCategory : handleAddCategory}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? t('common.saving') : t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {!isAddMode && !editingCategory && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme === 'dark' ? '#2196F3' : '#2196F3' }]}
            onPress={() => setIsAddMode(true)}
          >
            <Icon name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>{t('common.add')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id !== undefined ? item.id.toString() : 'temp-' + item.name}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  iconSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  iconOption: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginLeft: 10,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default CategoryManagementScreen;