import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useTaskContext } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n/i18n';
import ProgressChart from '../components/statistics/ProgressChart';
import CategoryChart from '../components/statistics/CategoryChart';
import PriorityChart from '../components/statistics/PriorityChart';
import StreakCard from '../components/statistics/StreakCard';

const StatisticsScreen: React.FC = () => {
  const { statistics, loading, getTaskStatistics } = useTaskContext();
  const { colors } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    loadStatistics();
  }, []);

  console.log("statistics", statistics)
  const loadStatistics = async () => {
    await getTaskStatistics();
  };

  const onRefresh = async () => {
    await loadStatistics();
  };

  if (!statistics || 
      (statistics.completedTasksCount === 0 && 
       statistics.pendingTasksCount === 0 && 
       (!statistics.tasksByCategory || statistics.tasksByCategory.length === 0) && 
       (!statistics.tasksByPriority || Object.keys(statistics.tasksByPriority).length === 0)
      )) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          {t('statistics.empty')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <Text style={[styles.header, { color: colors.text }]}>{t('statistics.title')}</Text>
      
      <ProgressChart statistics={statistics} />
      
      <StreakCard statistics={statistics} />
      
      <CategoryChart statistics={statistics} />
      
      <PriorityChart statistics={statistics} />
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          {t('statistics.last_updated')}: {new Date().toLocaleString()}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});

export default StatisticsScreen;