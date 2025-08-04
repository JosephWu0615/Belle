import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit';
import { theme } from '../../theme';
import { format } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

export const AIInsightsScreen = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'skinReport' | 'treatment'>('all');
  const [showFullHistory, setShowFullHistory] = useState(false);

  // Mock data for skin score
  const skinScore = 86;
  const scoreChange = 5;

  // Mock chart data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [78, 80, 79, 82, 81, 84, 86],
        color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  // Mock records data
  const skinRecords = [
    {
      id: '1',
      date: new Date('2025-07-20'),
      type: 'week' as const,
      issues: ['Issue 1', 'Issue 2', 'Issue 3'],
      title: 'Good Job!',
      description: 'Your skin condition has improved significantly this week, in terms of moisturizing and gloss.',
    },
    {
      id: '2',
      date: new Date('2025-07-27'),
      type: 'month' as const,
      issues: ['Issue 1', 'Issue 2', 'Issue 3'],
      title: 'Nice',
      description: 'Your skin condition has improved significantly this week, in terms of moisturizing and gloss.',
    },
  ];

  const treatmentRecords = [
    {
      id: '1',
      rating: 4.5,
      name: 'PicoSure',
      description: 'An advanced laser treatment that removes tattoos, fades pigmentation, and improves skin texture.',
      clinic: 'Belle Beauty Clinic',
      doctor: 'Dr. Smith',
      date: new Date('2025-08-02'),
      price: 20000,
      issues: ['Mild itching', 'Headache or pressure'],
    },
    {
      id: '2',
      rating: 4.5,
      name: 'PicoSure',
      description: 'An advanced laser treatment that removes tattoos, fades pigmentation, and improves skin texture.',
      clinic: 'Belle Beauty Clinic',
      doctor: 'Dr. Smith',
      date: new Date('2025-08-12'),
      price: 20000,
      issues: ['Mild itching', 'Headache or pressure'],
    },
  ];

  const renderTab = (tab: 'all' | 'skinReport' | 'treatment', label: string) => {
    return (
      <TouchableOpacity
        style={[styles.tab, activeTab === tab && styles.activeTab]}
        onPress={() => setActiveTab(tab)}
      >
        {tab === 'all' && activeTab === 'all' ? (
          <View style={styles.allTabCircle}>
            <Text style={styles.allTabText}>
              {label}
            </Text>
          </View>
        ) : (
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderSkinRecord = (record: typeof skinRecords[0]) => {
    return (
      <TouchableOpacity key={record.id} style={styles.recordCard}>
        <View style={styles.recordHeader}>
          <Text style={styles.recordDate}>
            {record.type === 'week' ? 'Week Review' : 'Month Review'}
          </Text>
          <Text style={styles.recordDateText}>
            {format(record.date, 'M/dd-M/dd')}
          </Text>
        </View>
        <Text style={styles.recordTitle}>{record.title}</Text>
        <View style={styles.recordIssues}>
          {record.issues.map((issue, index) => (
            <React.Fragment key={index}>
              <Icon name="lens" size={8} color={theme.colors.text.tertiary} />
              <Text style={styles.issueText}>{issue}:</Text>
            </React.Fragment>
          ))}
        </View>
        <Text style={styles.recordDescription}>{record.description}</Text>
        <Icon 
          name="chevron-right" 
          size={24} 
          color={theme.colors.text.tertiary} 
          style={styles.chevronIcon}
        />
      </TouchableOpacity>
    );
  };

  const renderTreatmentRecord = (record: typeof treatmentRecords[0]) => {
    return (
      <TouchableOpacity key={record.id} style={styles.treatmentCard}>
        <View style={styles.treatmentHeader}>
          <View style={styles.ratingBadge}>
            <Icon name="star" size={14} color="#fff" />
            <Text style={styles.ratingText}>{record.rating}</Text>
          </View>
          <Text style={styles.treatmentName}>{record.name}</Text>
        </View>
        <Text style={styles.treatmentDescription}>{record.description}</Text>
        <View style={styles.treatmentDetails}>
          <Text style={styles.detailText}>{record.clinic}</Text>
          <Text style={styles.detailText}>{record.doctor}</Text>
        </View>
        <View style={styles.treatmentFooter}>
          <Text style={styles.dateText}>{format(record.date, 'yyyy/MM/dd')}</Text>
          <Text style={styles.priceText}>${record.price.toLocaleString()}</Text>
        </View>
        <View style={styles.treatmentIssues}>
          {record.issues.map((issue, index) => (
            <View key={index} style={styles.issueChip}>
              <Text style={styles.issueEmoji}>😕</Text>
              <Text style={styles.issueChipText}>{issue}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Insight</Text>
        </View>

        {/* Score Section */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreHeader}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>Skin Score</Text>
            </View>
            <Text style={styles.scoreDate}>July, 26th</Text>
          </View>
          
          <View style={styles.scoreContent}>
            <View style={styles.scoreDisplay}>
              <Text style={styles.scoreValue}>{skinScore}</Text>
              <Text style={styles.scoreChange}>+{scoreChange}%</Text>
            </View>
            <View style={styles.chartContainer}>
              <LineChart
                data={chartData}
                width={screenWidth - 200}
                height={80}
                chartConfig={{
                  backgroundColor: 'transparent',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  fillShadowGradient: theme.colors.skin.score,
                  fillShadowGradientOpacity: 0.1,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(155, 163, 175, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '5',
                    strokeWidth: '0',
                    fill: theme.colors.skin.score,
                  },
                }}
                bezier
                style={styles.chartStyle}
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLabels={false}
                withHorizontalLabels={false}
                withDots={true}
                withShadow={false}
                fromZero={false}
                transparent={true}
              />
            </View>
          </View>
          
          <Text style={styles.scoreMessage}>
            Your overall skin score is {skinScore}, up {scoreChange}% from last week. View full report.
          </Text>
          <TouchableOpacity style={styles.deleteIcon}>
            <Icon name="more-horiz" size={20} color={theme.colors.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {renderTab('all', 'All')}
          {renderTab('skinReport', 'Skin Report')}
          {renderTab('treatment', 'Treatment')}
        </View>

        {/* Content based on active tab */}
        {activeTab === 'all' && (
          <>
            {/* Skin Record Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Skin Record</Text>
                <TouchableOpacity>
                  <Icon name="expand-less" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.nextReportText}>
                Next report will be unlocked in 2 days.
              </Text>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              {skinRecords.map(renderSkinRecord)}
            </View>

            {/* Treatment Record Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Treatment Record</Text>
                <TouchableOpacity>
                  <Icon name="expand-more" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
              </View>
              {treatmentRecords.map(renderTreatmentRecord)}
              {!showFullHistory && (
                <TouchableOpacity 
                  style={styles.viewFullHistory}
                  onPress={() => setShowFullHistory(true)}
                >
                  <Text style={styles.viewFullHistoryText}>View full history</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}

        {activeTab === 'skinReport' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skin Record</Text>
            {skinRecords.map(renderSkinRecord)}
          </View>
        )}

        {activeTab === 'treatment' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Treatment Record</Text>
            {treatmentRecords.map(renderTreatmentRecord)}
          </View>
        )}

        {/* Belle Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Belle</Text>
          <Text style={styles.logoSubtext}>Your Beauty Bestie</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.styles.largeTitle,
    color: theme.colors.text.primary,
  },
  scoreSection: {
    backgroundColor: theme.colors.background.primary,
    margin: theme.spacing.sm,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    position: 'relative',
    minHeight: 200,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  scoreBadge: {
    backgroundColor: theme.colors.skin.scoreBackground,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  scoreBadgeText: {
    ...theme.typography.styles.caption1,
    color: theme.colors.skin.score,
    fontWeight: theme.typography.fontWeight.medium,
  },
  scoreDate: {
    ...theme.typography.styles.caption1,
    color: theme.colors.text.tertiary,
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    minHeight: 100,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.lg,
  },
  scoreValue: {
    ...theme.typography.styles.largeTitle,
    fontSize: 48,
    color: theme.colors.skin.score,
    fontWeight: theme.typography.fontWeight.light,
    lineHeight: 52,
    includeFontPadding: false,
    marginTop: -5,
  },
  scoreChange: {
    ...theme.typography.styles.title3,
    color: theme.colors.skin.score,
    marginLeft: theme.spacing.sm,
  },
  chartContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: theme.spacing.lg,
  },
  scoreMessage: {
    ...theme.typography.styles.footnote,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  deleteIcon: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.layout.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  tab: {
    paddingVertical: theme.spacing.md,
    marginRight: theme.spacing['2xl'],
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.skin.score,
  },
  tabText: {
    ...theme.typography.styles.callout,
    color: theme.colors.text.tertiary,
  },
  activeTabText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  allTabCircle: {
    backgroundColor: theme.colors.skin.score,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  allTabText: {
    ...theme.typography.styles.callout,
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  section: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.xl,
    marginTop: theme.spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.styles.headline,
    color: theme.colors.text.primary,
  },
  nextReportText: {
    ...theme.typography.styles.footnote,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 2,
    marginBottom: theme.spacing.xl,
  },
  progressFill: {
    height: '100%',
    width: '30%',
    backgroundColor: theme.colors.skin.score,
    borderRadius: 2,
  },
  recordCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    position: 'relative',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  recordDate: {
    ...theme.typography.styles.caption1,
    color: theme.colors.secondary.purple,
    fontWeight: theme.typography.fontWeight.medium,
  },
  recordDateText: {
    ...theme.typography.styles.caption1,
    color: theme.colors.text.tertiary,
  },
  recordTitle: {
    ...theme.typography.styles.title3,
    color: theme.colors.secondary.purple,
    marginBottom: theme.spacing.sm,
  },
  recordIssues: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  issueText: {
    ...theme.typography.styles.caption1,
    color: theme.colors.text.tertiary,
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
  recordDescription: {
    ...theme.typography.styles.footnote,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  chevronIcon: {
    position: 'absolute',
    right: theme.spacing.lg,
    top: '50%',
    marginTop: -12,
  },
  treatmentCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  treatmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary.coral,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  ratingText: {
    ...theme.typography.styles.caption2,
    color: theme.colors.text.inverse,
    marginLeft: 2,
    fontWeight: theme.typography.fontWeight.medium,
  },
  treatmentName: {
    ...theme.typography.styles.headline,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.semiBold,
    fontSize: 18,
  },
  treatmentDescription: {
    ...theme.typography.styles.footnote,
    color: theme.colors.text.secondary,
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
    fontSize: 12,
  },
  treatmentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  detailText: {
    ...theme.typography.styles.caption2,
    color: theme.colors.text.tertiary,
    marginRight: theme.spacing.md,
    fontSize: 11,
  },
  treatmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  dateText: {
    ...theme.typography.styles.caption2,
    color: theme.colors.text.tertiary,
    fontSize: 11,
  },
  priceText: {
    ...theme.typography.styles.callout,
    color: '#00BFFF',
    fontWeight: theme.typography.fontWeight.medium,
  },
  treatmentIssues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  issueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.xs,
  },
  issueChipText: {
    ...theme.typography.styles.caption2,
    color: theme.colors.text.secondary,
    marginLeft: 4,
    fontSize: 10,
  },
  issueEmoji: {
    fontSize: 12,
  },
  viewFullHistory: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  viewFullHistoryText: {
    ...theme.typography.styles.footnote,
    color: theme.colors.text.tertiary,
    fontSize: 12,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing['4xl'],
  },
  logoText: {
    ...theme.typography.styles.title1,
    color: theme.colors.secondary.coral,
    fontWeight: theme.typography.fontWeight.light,
    fontSize: 36,
    fontStyle: 'italic',
  },
  logoSubtext: {
    ...theme.typography.styles.caption2,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
    fontSize: 10,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
});