import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';

export const AIIngredientSearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const ingredientImages = [
    require('../../../pictures/AIIngredientSearch1.jpg'),
    require('../../../pictures/AIIngredientSearch2.jpg'),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={28} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Ingredient Search</Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={theme.colors.text.tertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search ingredients..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Featured Ingredients */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Ingredients</Text>
          <View style={styles.imageGrid}>
            {ingredientImages.map((image, index) => (
              <TouchableOpacity key={index} style={styles.imageCard}>
                <Image source={image} style={styles.featuredImage} />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageTitle}>
                    {index === 0 ? 'Natural Ingredients' : 'Active Compounds'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Searches */}
        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Popular Searches</Text>
          <View style={styles.tagContainer}>
            {['Retinol', 'Hyaluronic Acid', 'Vitamin C', 'Niacinamide', 'Peptides'].map((tag) => (
              <TouchableOpacity key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  featuredSection: {
    backgroundColor: theme.colors.background.primary,
    marginTop: theme.spacing.sm,
    padding: theme.layout.screenPadding,
  },
  sectionTitle: {
    ...theme.typography.styles.title3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  imageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  imageCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: theme.spacing.md,
  },
  imageTitle: {
    ...theme.typography.styles.footnote,
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  popularSection: {
    backgroundColor: theme.colors.background.primary,
    marginTop: theme.spacing.sm,
    padding: theme.layout.screenPadding,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  tagText: {
    ...theme.typography.styles.caption1,
    color: theme.colors.text.primary,
  },
});