import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';

interface Treatment {
  id: string;
  name: string;
  brands: string[];
}

export const TreatmentScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('Botulinum');
  const [selectedTreatment, setSelectedTreatment] = useState('Botulinum Toxin');
  const [customTreatmentName, setCustomTreatmentName] = useState('"Botulinum"');

  const treatments: Treatment[] = [
    {
      id: '1',
      name: 'Botulinum Toxin',
      brands: ['Botox', 'Dysport', 'Xeomin'],
    },
    {
      id: '2',
      name: 'Dermal Fillers',
      brands: ['Juvederm', 'Restylane', 'Radiesse'],
    },
    {
      id: '3',
      name: 'Chemical Peel',
      brands: ['VI Peel', 'Perfect Derma', 'Obagi'],
    },
    {
      id: '4',
      name: 'Laser Treatment',
      brands: ['Fraxel', 'Clear + Brilliant', 'IPL'],
    },
    {
      id: '5',
      name: 'Microneedling',
      brands: ['SkinPen', 'Dermapen', 'Eclipse MicroPen'],
    },
  ];

  const filteredTreatments = treatments.filter(treatment =>
    treatment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    treatment.brands.some(brand => brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectTreatment = (treatment: Treatment) => {
    setSelectedTreatment(treatment.name);
    setCustomTreatmentName(`"${treatment.name}"`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={28} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Treatment</Text>
          <View style={styles.headerSpace} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Search Section */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Icon name="search" size={20} color={theme.colors.text.tertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search treatments..."
                placeholderTextColor={theme.colors.text.tertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Selected Treatment Display */}
          <View style={styles.selectedSection}>
            <Text style={styles.selectedTitle}>{selectedTreatment}</Text>
            <Text style={styles.selectedBrands}>
              {treatments.find(t => t.name === selectedTreatment)?.brands.join(', ')}
            </Text>
          </View>

          {/* Custom Name Input */}
          <View style={styles.customNameSection}>
            <TextInput
              style={styles.customNameInput}
              value={customTreatmentName}
              onChangeText={setCustomTreatmentName}
              placeholder="Add your own treatment name"
              placeholderTextColor={theme.colors.text.tertiary}
            />
            <Text style={styles.customNameHint}>Add your own treatment name</Text>
          </View>

          {/* Treatment List */}
          <View style={styles.treatmentList}>
            {filteredTreatments.map((treatment) => (
              <TouchableOpacity
                key={treatment.id}
                style={[
                  styles.treatmentItem,
                  selectedTreatment === treatment.name && styles.selectedTreatmentItem,
                ]}
                onPress={() => handleSelectTreatment(treatment)}
              >
                <View>
                  <Text style={styles.treatmentName}>{treatment.name}</Text>
                  <Text style={styles.treatmentBrands}>{treatment.brands.join(', ')}</Text>
                </View>
                {selectedTreatment === treatment.name && (
                  <Icon name="check" size={20} color={theme.colors.primary.blue} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Treatment</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  keyboardView: {
    flex: 1,
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
  headerSpace: {
    width: 40,
  },
  searchSection: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    ...theme.typography.styles.callout,
    color: theme.colors.text.primary,
  },
  selectedSection: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  selectedTitle: {
    ...theme.typography.styles.title2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  selectedBrands: {
    ...theme.typography.styles.footnote,
    color: theme.colors.text.secondary,
  },
  customNameSection: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  customNameInput: {
    ...theme.typography.styles.headline,
    color: theme.colors.text.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    paddingBottom: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  customNameHint: {
    ...theme.typography.styles.caption1,
    color: theme.colors.text.tertiary,
  },
  treatmentList: {
    backgroundColor: theme.colors.background.primary,
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  treatmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  selectedTreatmentItem: {
    backgroundColor: theme.colors.primary.blueLight + '20',
  },
  treatmentName: {
    ...theme.typography.styles.callout,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  treatmentBrands: {
    ...theme.typography.styles.caption1,
    color: theme.colors.text.secondary,
  },
  bottomSection: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing['3xl'],
  },
  saveButton: {
    backgroundColor: theme.colors.primary.blue,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.button,
    alignItems: 'center',
  },
  saveButtonText: {
    ...theme.typography.styles.callout,
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
});