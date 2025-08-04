import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';

interface Product {
  id: string;
  name: string;
  image: any;
  rating: number;
  isLastAdded?: boolean;
}

export const ProductScreen = () => {
  const navigation = useNavigation();
  const productImages = [
    require('../../../pictures/MyProducts1.png'),
    require('../../../pictures/MyProducts2.jpg'),
    require('../../../pictures/MyProducts3.jpg'),
  ];

  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Berry white eye serum',
      image: productImages[0],
      rating: 4.5,
      isLastAdded: true,
    },
    {
      id: '2',
      name: 'Berry white eye serum',
      image: productImages[1],
      rating: 4.5,
    },
    {
      id: '3',
      name: 'Berry white eye serum',
      image: productImages[2],
      rating: 4.5,
    },
    {
      id: '4',
      name: 'Berry white eye serum',
      image: productImages[0],
      rating: 4.5,
    },
    {
      id: '5',
      name: 'Berry white eye serum',
      image: productImages[1],
      rating: 4.5,
    },
    {
      id: '6',
      name: 'Berry white eye serum',
      image: productImages[2],
      rating: 4.5,
    },
  ]);

  const handleScanBarcode = () => {
    // TODO: Navigate to barcode scanner
    console.log('Scan barcode');
  };

  const handleSearchManually = () => {
    // TODO: Navigate to manual search
    console.log('Search manually');
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard}>
      {item.isLastAdded && (
        <View style={styles.lastAddedBadge}>
          <Text style={styles.lastAddedText}>Last Added</Text>
        </View>
      )}
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.productImage} />
      </View>
      <View style={styles.ratingBadge}>
        <Icon name="star" size={12} color="#fff" />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>
      <Text style={styles.productName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={28} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product</Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Add Product Section */}
        <View style={styles.addProductSection}>
          <View style={styles.addProductHeader}>
            <Text style={styles.addProductTitle}>Add Your Product</Text>
            <Icon name="view-list" size={24} color={theme.colors.text.tertiary} />
          </View>
          <Text style={styles.addProductSubtitle}>
            Point camera at product Barcode
          </Text>
          
          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleScanBarcode}
          >
            <Text style={styles.scanButtonText}>Scan Barcode</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleSearchManually}>
            <Text style={styles.searchManuallyText}>or search manually</Text>
          </TouchableOpacity>
        </View>

        {/* Your Product Section */}
        <View style={styles.yourProductSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Product</Text>
            <TouchableOpacity>
              <Icon name="settings" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            scrollEnabled={false}
            contentContainerStyle={styles.productGrid}
          />
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
  addProductSection: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.layout.screenPadding,
    marginBottom: theme.spacing.sm,
  },
  addProductHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  addProductTitle: {
    ...theme.typography.styles.title3,
    color: theme.colors.text.primary,
  },
  addProductSubtitle: {
    ...theme.typography.styles.footnote,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  scanButton: {
    backgroundColor: theme.colors.secondary.coral,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.button,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  scanButtonText: {
    ...theme.typography.styles.callout,
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  searchManuallyText: {
    ...theme.typography.styles.footnote,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
  yourProductSection: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.layout.screenPadding,
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
  },
  productGrid: {
    paddingBottom: theme.spacing.xl,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: theme.spacing.lg,
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.tertiary,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  lastAddedBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.belle.pink,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    zIndex: 1,
  },
  lastAddedText: {
    ...theme.typography.styles.caption2,
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.medium,
  },
  ratingBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  ratingText: {
    ...theme.typography.styles.caption2,
    color: theme.colors.text.inverse,
    marginLeft: 2,
    fontWeight: theme.typography.fontWeight.medium,
  },
  productName: {
    ...theme.typography.styles.footnote,
    color: theme.colors.text.primary,
  },
});