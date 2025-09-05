import React, {useMemo} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {useTheme} from '../../context/ThemeContext';
import {TaskStatistics} from '../../types/Task';
import {useTranslation} from '../../i18n/i18n';

interface CategoryChartProps {
  statistics: TaskStatistics;
}

const CategoryChart: React.FC<CategoryChartProps> = ({statistics}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();

  // Lấy tối đa 5 danh mục có nhiều task nhất
  const categories = Array.isArray(statistics.tasksByCategory)
    ? statistics.tasksByCategory
        .filter(category => !isNaN(category.count) && category.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    : Object.entries(statistics.tasksByCategory || {})
        .filter(([_, count]) => !isNaN(count as number) && (count as number) > 0)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 5);

  const chartData = {
    labels: Array.isArray(statistics.tasksByCategory)
      ? (categories as Array<{categoryId: number; categoryName: string; categoryColor: string; count: number}>).map(category => {
          const name = category.categoryName;
          return name.length > 10 ? `${name.substring(0, 10)}...` : name;
        })
      : (categories as Array<[string, number]>).map(([name]) =>
          name.length > 10 ? `${name.substring(0, 10)}...` : name,
        ),
    datasets: [
      {
        data: Array.isArray(statistics.tasksByCategory)
          ? (categories as Array<{categoryId: number; categoryName: string; categoryColor: string; count: number}>).map(category => category.count)
          : (categories as Array<[string, number]>).map(([_, count]) => count as number),
        colors: [
          (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // Xanh dương
          (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Xanh lá
          (opacity = 1) => `rgba(255, 152, 0, ${opacity})`, // Cam
          (opacity = 1) => `rgba(156, 39, 176, ${opacity})`, // Tím
          (opacity = 1) => `rgba(244, 67, 54, ${opacity})`, // Đỏ
        ],
      },
    ],
  };

  // Đã xóa console.log không cần thiết

  // Đã xử lý dữ liệu danh mục
  const segments = useMemo(() => {
    let maxCount = 0;
    if (chartData.datasets[0].data.length > 0) {
      chartData.datasets[0].data.forEach(item => {
        if (item > maxCount) {
          maxCount = item as number;
        }
      });
    }
    return Math.min(Math.max(maxCount, 1), 5);
  }, [chartData]);
  return (
    <View style={[styles.container, {backgroundColor: colors.card}]}>
      <Text style={[styles.title, {color: colors.text}]}>
        {t('statistics.by_category')}
      </Text>
      <View style={styles.chartContainer}>
        {categories.length > 0 ? (
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
                const colors = chartData.datasets[0].colors;
                const colorIndex = typeof index === 'number' ? index : 0;
                if (colorIndex >= 0 && colorIndex < colors.length) {
                  return colors[colorIndex](opacity);
                }
                return `rgba(33, 150, 243, ${opacity})`; // Màu mặc định nếu không tìm thấy màu
              },
              labelColor: () => colors.text,
              style: {
                borderRadius: 16,
              },
              propsForLabels: {
                fontSize: 10,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            showValuesOnTopOfBars
            fromZero={true}
          />
        ) : (
          <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
            {t('statistics.no_category_data')}
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
    shadowOffset: {width: 0, height: 1},
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

export default CategoryChart;
