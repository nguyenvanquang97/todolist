import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { Project } from '../../types/Task';
import { useTranslation } from 'react-i18next';
import { NavigationProp } from '@react-navigation/native';
import { format } from 'date-fns';

interface ProjectItemProps {
  project: Project;
  onPress: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, onPress, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return colors.warning;
      case 'in_progress':
        return colors.primary;
      case 'completed':
        return colors.success;
      case 'on_hold':
        return colors.error;
      default:
        return colors.text;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not_started':
        return t('not_started');
      case 'in_progress':
        return t('in_progress');
      case 'completed':
        return t('completed');
      case 'on_hold':
        return t('on_hold');
      default:
        return status;
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return t('not_set');
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card, borderLeftColor: project.color || colors.primary }]}
      onPress={() => onPress(project)}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{project.name}</Text>
        
        {project.description ? (
          <Text 
            style={[styles.description, { color: colors.text + 'CC' }]}
            numberOfLines={2}
          >
            {project.description}
          </Text>
        ) : null}
        
        <View style={styles.detailsRow}>
          <View style={styles.dateContainer}>
            <Text style={[styles.dateLabel, { color: colors.text + '99' }]}>{t('start')}:</Text>
            <Text style={[styles.dateValue, { color: colors.text }]}>{formatDate(project.start_date)}</Text>
          </View>
          
          <View style={styles.dateContainer}>
            <Text style={[styles.dateLabel, { color: colors.text + '99' }]}>{t('end')}:</Text>
            <Text style={[styles.dateValue, { color: colors.text }]}>{formatDate(project.end_date)}</Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) + '33' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(project.status) }]}>
              {getStatusText(project.status)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onEdit(project)}
        >
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>{t('edit')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onDelete(project.id!)}
        >
          <Text style={[styles.actionButtonText, { color: colors.error }]}>{t('delete')}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderLeftWidth: 4,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#00000020',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProjectItem;