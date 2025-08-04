import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useRecordStore } from '../../store/recordStore';
import { Card, CircularProgress } from '../../components/common';
import { theme } from '../../theme';

export const DashboardScreen = () => {
  const navigation = useNavigation();
  // const { records } = useRecordStore(); // TODO: Use for actual streak calculation
  const [streakDays] = useState(14); // TODO: Calculate actual streak


  const handleSkinScan = () => {
    navigation.navigate('PhotoCapture' as never);
  };

  const handleTreatment = () => {
    navigation.navigate('Treatment' as never);
  };

  const handleProduct = () => {
    navigation.navigate('Product' as never);
  };

  const handleMyProducts = () => {
    navigation.navigate('Product' as never);
  };

  const handleIngredientSearch = () => {
    navigation.navigate('AIIngredientSearch' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Icon name="person" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Streak Section */}
        <View style={styles.streakSection}>
          <View style={styles.streakContent}>
            <View>
              <Text style={styles.streakTitle}>{streakDays} Days Streak!</Text>
              <Text style={styles.streakSubtitle}>So proud of your consistency, Ziqi!</Text>
            </View>
            <CircularProgress
              size={60}
              progress={70}
              gradient={theme.colors.gradient.streak}
            />
          </View>
        </View>

        {/* Record Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Record</Text>
          
          {/* Large Skin Scan Card */}
          <TouchableOpacity style={styles.skinScanCard} onPress={handleSkinScan}>
            <Image 
              source={require('../../../pictures/SkinScan.png')} 
              style={styles.workingImage}
            />
            <View style={styles.textOverlay}>
              <Text style={styles.cardTitle}>Skin Scan</Text>
              <Text style={styles.cardSubtitle}>What's your today's skin condition</Text>
            </View>
          </TouchableOpacity>
          
          {/* Treatment and Product Cards Row */}
          <View style={styles.recordRow}>
            <Card
              title="Treatment"
              subtitle={"Track your\nbeauty treatment"}
              backgroundColor={theme.colors.secondary.coral}
              onPress={handleTreatment}
              style={styles.halfCard}
              size="medium"
              titleStyle={styles.cardTitleStyle}
              subtitleStyle={styles.cardSubtitleStyle}
              icon={<View style={styles.dotGrid}>
                {[...Array(9)].map((_, i) => (
                  <View key={i} style={styles.gridDot} />
                ))}
              </View>}
            />
            <Card
              title="Product"
              subtitle={"Analysis with\nyour own feedback"}
              backgroundColor={theme.colors.secondary.purple}
              onPress={handleProduct}
              style={styles.halfCard}
              size="medium"
              titleStyle={styles.cardTitleStyle}
              subtitleStyle={styles.cardSubtitleStyle}
              icon={<Icon name="science" size={32} color="white" />}
            />
          </View>
        </View>

        {/* Explore Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore</Text>
            <Icon name="explore" size={20} color={theme.colors.text.secondary} />
          </View>
          
          {/* My Products Card */}
          <TouchableOpacity style={styles.exploreItem} onPress={handleMyProducts}>
            <View style={styles.exploreHeader}>
              <View style={styles.exploreIconContainer}>
                <Icon name="grid-view" size={20} color={theme.colors.text.primary} />
              </View>
              <Text style={styles.exploreTitle}>My Products</Text>
            </View>
            <View style={styles.productPreview}>
              <View style={styles.productStack}>
                <Image
                  source={require('../../../pictures/MyProducts1.png')}
                  style={[styles.productStackImage, styles.productImage1]}
                />
                <Image
                  source={require('../../../pictures/MyProducts2.jpg')}
                  style={[styles.productStackImage, styles.productImage2]}
                />
              </View>
            </View>
          </TouchableOpacity>
          
          {/* AI Ingredient Search Card */}
          <TouchableOpacity style={styles.exploreItem} onPress={handleIngredientSearch}>
            <View style={styles.exploreHeader}>
              <View style={styles.exploreIconContainer}>
                <Icon name="search" size={20} color={theme.colors.text.primary} />
              </View>
              <Text style={styles.exploreTitle}>AI Ingredient Search</Text>
            </View>
            <View style={styles.ingredientPreview}>
              <Image
                source={require('../../../pictures/AIIngredientSearch1.jpg')}
                style={[styles.ingredientImage, styles.ingredientImage1]}
              />
              <Image
                source={require('../../../pictures/AIIngredientSearch2.jpg')}
                style={[styles.ingredientImage, styles.ingredientImage2]}
              />
            </View>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
  },
  headerTitle: {
    ...theme.typography.styles.largeTitle,
    color: theme.colors.text.primary,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakSection: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  streakContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakTitle: {
    ...theme.typography.styles.title2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  streakSubtitle: {
    ...theme.typography.styles.subheadline,
    color: theme.colors.text.secondary,
  },
  section: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.styles.title3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  skinScanCard: {
    height: 180,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.card,
    overflow: 'hidden',
    position: 'relative',
  },
  testImage: {
    position: 'absolute',
    top: 0,
    left: '40%', // Start image from where text overlay ends
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
  },
  fullTestImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
    zIndex: 1,
    opacity: 1, // Ensure full opacity
  },
  testOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%', // Blue area takes 50%, image takes 50%
    bottom: 0,
    backgroundColor: 'rgba(91, 200, 248, 0.95)',
    justifyContent: 'center',
    paddingLeft: theme.spacing.lg,
    zIndex: 2,
  },
  testText: {
    ...theme.typography.styles.title2,
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.bold,
  },
  testSubtext: {
    ...theme.typography.styles.callout,
    color: theme.colors.text.inverse,
    opacity: 0.9,
    marginTop: theme.spacing.xs,
  },
  workingImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '40%',
    height: '100%',
    backgroundColor: 'rgba(91, 200, 248, 0.9)',
    justifyContent: 'center',
    paddingLeft: theme.spacing.md,
    borderTopLeftRadius: theme.borderRadius.card,
    borderBottomLeftRadius: theme.borderRadius.card,
  },
  cardTitle: {
    ...theme.typography.styles.title2,
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
    fontSize: 20,
  },
  cardSubtitle: {
    ...theme.typography.styles.callout,
    color: theme.colors.text.inverse,
    opacity: 0.9,
    fontSize: 13,
    lineHeight: 16,
  },
  recordRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  halfCard: {
    flex: 1,
    height: 140,
  },
  dotPattern: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 24,
    height: 16,
    justifyContent: 'space-between',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.text.inverse,
    marginBottom: 2,
  },
  dotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 29,
    height: 29,
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  gridDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginBottom: 3.5,
    marginRight: 3.5,
  },
  cardTitleStyle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitleStyle: {
    lineHeight: 18,
    fontSize: 13,
    opacity: 0.9,
  },
  exploreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  exploreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exploreIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  exploreTitle: {
    ...theme.typography.styles.callout,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  productPreview: {
    marginLeft: 'auto',
  },
  productStack: {
    position: 'relative',
    width: 60,
    height: 40,
  },
  productStackImage: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  productImage1: {
    top: 0,
    left: 0,
    zIndex: 1,
  },
  productImage2: {
    top: 0,
    right: 0,
    zIndex: 2,
  },
  ingredientPreview: {
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: -10,
  },
  ingredientImage: {
    width: 50,
    height: 40,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  ingredientImage1: {
    zIndex: 1,
  },
  ingredientImage2: {
    marginLeft: -10,
    zIndex: 2,
  },
});