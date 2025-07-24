import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { showToast } from '@components/Toast';
import { useTaskContext } from '@context/TaskContext';
import { Tag } from '@/types/Task';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ColorPicker from '@components/ColorPicker';
import { useTheme } from '@context/ThemeContext';
import { useTranslation } from '@i18n/i18n';

const TagManagementScreen: React.FC = () => {
  const { tags, addTag, updateTag, deleteTag, loading } = useTaskContext();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3498db');

  const resetForm = () => {
    setName('');
    setColor('#3498db');
    setEditingTag(null);
    setIsAddMode(false);
  };

  const handleAddTag = () => {
    if (!name.trim()) {
      showToast('error', t('common.error'), t('common.errors.validation'));
      return;
    }

    addTag({
      name: name.trim(),
      color,
    }).then(() => {
      resetForm();
    });
  };

  const handleUpdateTag = () => {
    if (!editingTag || editingTag.id === undefined) return;
    if (!name.trim()) {
      showToast('error', t('common.error'), t('common.errors.validation'));
      return;
    }

    updateTag(editingTag.id, {
      name: name.trim(),
      color,
    }).then(() => {
      resetForm();
    });
  };

  const handleDeleteTag = (id: number) => {
    // Show confirmation message
    showToast('info', t('common.confirm'), t('taskDetail.deleteConfirmMessage'));
    
    // Add confirmation dialog with custom UI instead of using Alert
    // For now, we'll just proceed with deletion as a temporary solution
    // In a real implementation, you would show a custom confirmation dialog here
    setTimeout(() => {
      deleteTag(id).then(() => {
        resetForm();
        showToast('success', t('common.success'), t('common.deleted'));
      }).catch(error => {
        showToast('error', t('common.error'), t('common.deleteError'));
      });
    }, 1500);
  };

  const startEditing = (tag: Tag) => {
    setEditingTag(tag);
    setName(tag.name);
    setColor(tag.color);
    setIsAddMode(false);
  };

  const renderTagItem = ({ item }: { item: Tag }) => {
    const isEditing = editingTag?.id === item.id;

    return (
      <View style={[styles.tagItem, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
        <View style={[styles.tagColor, { backgroundColor: item.color }]} />
        <View style={styles.tagInfo}>
          <Text style={[styles.tagName, { color: theme === 'dark' ? '#fff' : '#000' }]}>{item.name}</Text>
          <Text style={[styles.tagUsage, { color: theme === 'dark' ? '#aaa' : '#666' }]}>
            {(item.usage_count || 0) === 1 ? '1 task' : `${item.usage_count || 0} tasks`}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => startEditing(item)} style={styles.actionButton}>
            <Icon name="edit" size={20} color={theme === 'dark' ? '#ccc' : '#666'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => item.id !== undefined && handleDeleteTag(item.id)} style={styles.actionButton}>
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
          {isAddMode ? t('common.add') : editingTag ? t('common.edit') : t('settings.tags')}
        </Text>

        {(isAddMode || editingTag) && (
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

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0' }]}
                onPress={resetForm}
              >
                <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton, { backgroundColor: color }]}
                onPress={editingTag ? handleUpdateTag : handleAddTag}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? t('common.saving') : t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {!isAddMode && !editingTag && (
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
        data={tags}
        renderItem={renderTagItem}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
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
  tagItem: {
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
  tagColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  tagInfo: {
    flex: 1,
  },
  tagName: {
    fontSize: 16,
    fontWeight: '500',
  },
  tagUsage: {
    fontSize: 12,
    marginTop: 2,
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

export default TagManagementScreen;