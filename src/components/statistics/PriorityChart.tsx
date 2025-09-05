import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/ThemeContext';
import { TaskStatistics } from '../../types/Task';
import { useTranslation } from '../../i18n/i18n';

interface PriorityChartProps {
  statistics: TaskStatistics;
}

const PriorityChart: React.FC<PriorityChartProps> = ({ statistics }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const priorityLabels: Record<string, string> = {
    'high': t('task.priority.high'),
    'medium': t('task.priority.medium'),
    'low': t('task.priority.low'),
  };
  
  // Sắp xếp độ ưu tiên theo thứ tự: low, medium, high
  const priorityOrder = ['low', 'medium', 'high'];
  
  const priorities = priorityOrder
    .map(priority => ({
      priority,
      label: priorityLabels[priority] || priority,
      count: isNaN(statistics.tasksByPriority?.[priority]) ? 0 : statistics.tasksByPriority?.[priority],
    }))
    .filter(item => item.count > 0);
  
  const chartData = {
    labels: priorities.map(item => item.label),
    datasets: [
      {
        data: priorities.map(item => item.count),
        colors: priorities.map(item => {
          // Sử dụng màu từ theme thay vì hardcode
          const color = colors.priority[item.priority as keyof typeof colors.priority] || colors.primary;
          // Chuyển đổi hex sang rgba
          const hexToRgba = (hex: string, opacity: number) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
          };
          return (opacity = 1) => hexToRgba(color, opacity);
        }),
      },
    ],
  };

  
  // Đảm bảo chartData luôn có ít nhất một phần tử và theo đúng thứ tự
  if (chartData.labels.length === 0) {
    // Hiển thị theo thứ tự: low, medium, high
    chartData.labels = [t('task.priority.low'), t('task.priority.medium'), t('task.priority.high')];
    chartData.datasets[0].data = [0, 0, 0];
    chartData.datasets[0].colors = [
      (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // low - green
      (opacity = 1) => `rgba(255, 152, 0, ${opacity})`, // medium - orange
      (opacity = 1) => `rgba(244, 67, 54, ${opacity})`, // high - red
    ];
  }

  const segments = useMemo(() => {
    let maxCount = 0;
    if(chartData.datasets[0].data.length > 0){
      chartData.datasets[0].data.forEach(item => {
        if(item > maxCount){
          maxCount = item as number;
        }
      });
    }
    return Math.min(Math.max(maxCount,1), 5);
  }, [chartData]);
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('statistics.by_priority')}</Text>
      <View style={styles.chartContainer}>
        {priorities.length > 0 ? (
          <BarChart
            data={chartData}
            width={Dimensions.get('window').width - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            segments={segments} // Giới hạn số đoạn trên trục y
            chartConfig={{
              backgroundColor: colors.card,
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.card,
              decimalPlaces: 0,
              color: (opacity = 1, index) => {
                // Sử dụng màu từ mảng colors nếu có, nếu không thì dùng màu mặc định
                const colorIndex = typeof index === 'number' ? index : 0;
                const colors = chartData.datasets[0].colors;
                return colorIndex < colors.length ? 
                  colors[colorIndex](opacity) : 
                  `rgba(33, 150, 243, ${opacity})`;
              },
              labelColor: () => colors.text,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            showValuesOnTopOfBars
            fromZero
          />
        ) : (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t('statistics.no_priority_data')}
          </Text>
        )}
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
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default PriorityChart;