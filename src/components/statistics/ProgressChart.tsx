import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { TaskStatistics } from '../../types/Task';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/i18n';

interface ProgressChartProps {
  statistics: TaskStatistics;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ statistics }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const chartData = [
    {
      name: t('task.status.completed'),
      population: statistics.completedTasksCount,
      color: '#4CAF50',
      legendFontColor: colors.text,
    },
    {
      name: t('task.status.pending'),
      population: statistics.pendingTasksCount,
      color: '#2196F3',
      legendFontColor: colors.text,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('statistics.progress')}</Text>
      <View style={styles.chartContainer}>
        {(statistics.completedTasksCount > 0 || statistics.pendingTasksCount > 0) ? (
          <PieChart
            data={chartData}
            width={Dimensions.get('window').width - 60}
            height={180}
            chartConfig={{
              backgroundColor: colors.card,
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.card,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: () => colors.text,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
        ) : (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t('statistics.no_data')}
          </Text>
        )}
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {statistics.completedTasksCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('task.status.completed')}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {statistics.pendingTasksCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('task.status.pending')}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {isNaN(statistics.completionRate) ? '0' : `${statistics.completionRate.toFixed(0)}%`}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('statistics.completion_rate')}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default ProgressChart;