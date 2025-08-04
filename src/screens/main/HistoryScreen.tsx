import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { format } from 'date-fns';

interface SkinRecord {
  id: string;
  date: Date;
  type: 'week' | 'month';
  issues: string[];
  title: string;
  description: string;
}

interface TreatmentRecord {
  id: string;
  rating: number;
  name: string;
  description: string;
  clinic: string;
  doctor: string;
  date: Date;
  price: number;
  issues: string[];
}

export const HistoryScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'all' | 'skinReport' | 'treatment'>('all');
  const [selectedMonth] = useState('July');

  const skinRecords: SkinRecord[] = [
    {
      id: '1',
      date: new Date('2025-07-20'),
      type: 'month',
      issues: ['Issue 1', 'Issue 2', 'Issue 3'],
      title: 'Nice!',
      description: 'Your skin condition has improved significantly this week, in terms of moisturizing and gloss.',
    },
    {
      id: '2',
      date: new Date('2025-07-27'),
      type: 'week',
      issues: ['Issue 1', 'Issue 2', 'Issue 3'],
      title: 'Good Job!',
      description: 'Your skin condition has improved significantly this week, in terms of moisturizing and gloss.',
    },
    {
      id: '3',
      date: new Date('2025-06-20'),
      type: 'month',
      issues: ['Issue 1', 'Issue 2', 'Issue 3'],
      title: 'Nice',
      description: 'Your skin condition has improved significantly this week, in terms of moisturizing and gloss.',
    },
  ];

  const treatmentRecords: TreatmentRecord[] = [
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
        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSkinRecord = (record: SkinRecord) => {
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

  const renderTreatmentRecord = (record: TreatmentRecord) => {
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
              <Icon name="sentiment-satisfied" size={12} color={theme.colors.warning} />
              <Text style={styles.issueChipText}>{issue}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  const filterRecordsByTab = () => {
    if (activeTab === 'skinReport') {
      return { skinRecords, treatmentRecords: [] };
    } else if (activeTab === 'treatment') {
      return { skinRecords: [], treatmentRecords };
    }
    return { skinRecords, treatmentRecords };
  };

  const { skinRecords: filteredSkinRecords, treatmentRecords: filteredTreatmentRecords } = filterRecordsByTab();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={28} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Icon name="calendar-today" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {renderTab('all', 'All')}
        {renderTab('skinReport', 'Skin Report')}
        {renderTab('treatment', 'Treatment')}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Month Section */}
        <View style={styles.monthSection}>
          <Text style={styles.monthText}>{selectedMonth}</Text>
          <Text style={styles.lastMonthText}>Last month</Text>
        </View>

        {/* Skin Records */}
        {filteredSkinRecords.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skin Record</Text>
            {filteredSkinRecords.map(renderSkinRecord)}
            <TouchableOpacity style={styles.showMoreButton}>
              <Text style={styles.showMoreText}>Show more</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Treatment Records */}
        {filteredTreatmentRecords.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Treatment Record</Text>
            {filteredTreatmentRecords.map(renderTreatmentRecord)}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.styles.headline,
    color: theme.colors.text.primary,
  },
  calendarButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  monthSection: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.lg,
  },
  monthText: {
    ...theme.typography.styles.title2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  lastMonthText: {
    ...theme.typography.styles.caption1,
    color: theme.colors.text.tertiary,
  },
  section: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.styles.headline,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
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
  showMoreButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  showMoreText: {
    ...theme.typography.styles.footnote,
    color: theme.colors.text.tertiary,
  },
  treatmentCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
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
    backgroundColor: theme.colors.skin.score,
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
  },
  treatmentDescription: {
    ...theme.typography.styles.footnote,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  treatmentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  detailText: {
    ...theme.typography.styles.caption1,
    color: theme.colors.text.tertiary,
    marginRight: theme.spacing.lg,
  },
  treatmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  dateText: {
    ...theme.typography.styles.footnote,
    color: theme.colors.text.tertiary,
  },
  priceText: {
    ...theme.typography.styles.callout,
    color: theme.colors.primary.blue,
    fontWeight: theme.typography.fontWeight.medium,
  },
  treatmentIssues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  issueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  issueChipText: {
    ...theme.typography.styles.caption2,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing['4xl'],
  },
  logoText: {
    ...theme.typography.styles.title1,
    color: theme.colors.belle.pink,
    fontWeight: theme.typography.fontWeight.bold,
  },
  logoSubtext: {
    ...theme.typography.styles.caption1,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
});