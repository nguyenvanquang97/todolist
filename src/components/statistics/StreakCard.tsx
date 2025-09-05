import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../context/ThemeContext';
import { TaskStatistics } from '../../types/Task';
import { useTranslation } from '../../i18n/i18n';

interface StreakCardProps {
  statistics: TaskStatistics;
}

const StreakCard: React.FC<StreakCardProps> = ({ statistics }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('statistics.streak')}</Text>
      <View style={styles.streakContainer}>
        <View style={styles.streakItem}>
          <Icon name="fire" size={32} color="#FF9800" />
          <Text style={[styles.streakValue, { color: colors.text }]}>
            {isNaN(statistics.currentStreak) ? 0 : statistics.currentStreak}
          </Text>
          <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>{t('statistics.current_streak')}</Text>
        </View>
        <View style={styles.streakItem}>
          <Icon name="trophy" size={32} color="#FFC107" />
          <Text style={[styles.streakValue, { color: colors.text }]}>
            {isNaN(statistics.longestStreak) ? 0 : statistics.longestStreak}
          </Text>
          <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>{t('statistics.longest_streak')}</Text>
        </View>
      </View>
      <View style={styles.messageContainer}>
        {statistics.currentStreak > 0 ? (
          <Text style={[styles.message, { color: colors.text }]}>
            {t('statistics.streak_message', { count: statistics.currentStreak })}
          </Text>
        ) : (
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {t('statistics.start_streak_message')}
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
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  streakItem: {
    alignItems: 'center',
  },
  streakValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  streakLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default StreakCard;