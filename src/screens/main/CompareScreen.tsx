import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { usePhotoStore } from '../../store/photoStore';
import { Photo } from '../../types';
import { format } from 'date-fns';
import { mockComparePhotos } from '../../services/mockApi';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const CompareScreen = () => {
  const { photos, getRecentPhotos } = usePhotoStore();
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([]);
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);
  const [selectingIndex, setSelectingIndex] = useState<number>(0);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Auto-select two most recent photos if available
    const recentPhotos = getRecentPhotos(2);
    if (recentPhotos.length === 2) {
      setSelectedPhotos(recentPhotos);
    }
  }, [getRecentPhotos]);

  const handlePhotoSelect = (index: number) => {
    setSelectingIndex(index);
    setShowPhotoSelector(true);
  };

  const selectPhoto = (photo: Photo) => {
    const newSelection = [...selectedPhotos];
    newSelection[selectingIndex] = photo;
    setSelectedPhotos(newSelection);
    setShowPhotoSelector(false);
  };

  const comparePhotos = useCallback(async () => {
    if (selectedPhotos.length < 2) return;
    
    setIsLoading(true);
    try {
      const photoIds = selectedPhotos.map(p => p.id);
      const comparison = await mockComparePhotos(photoIds);
      setComparisonData(comparison);
    } catch (error) {
      console.error('Failed to compare photos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPhotos]);

  useEffect(() => {
    if (selectedPhotos.length === 2) {
      comparePhotos();
    }
  }, [selectedPhotos, comparePhotos]);

  const renderPhotoSelector = () => {
    const photoArray = Array.from(photos.values()).sort(
      (a, b) => b.takenAt.getTime() - a.takenAt.getTime()
    );

    return (
      <Modal
        visible={showPhotoSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPhotoSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Photo</Text>
              <TouchableOpacity onPress={() => setShowPhotoSelector(false)}>
                <Icon name="close" size={24} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={photoArray}
              keyExtractor={(item) => item.id}
              numColumns={3}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.gridPhoto}
                  onPress={() => selectPhoto(item)}
                >
                  <Image source={{ uri: item.uri }} style={styles.gridPhotoImage} />
                  <Text style={styles.gridPhotoDate}>
                    {format(new Date(item.takenAt), 'MM/dd')}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const renderChart = () => {
    if (!comparisonData || !comparisonData.trends) return null;

    const trend = comparisonData.trends[0]; // Overall score trend
    
    const data = {
      labels: selectedPhotos.map(p => format(new Date(p.takenAt), 'MM/dd')),
      datasets: [
        {
          data: trend.values,
          color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Skin Score Trend</Text>
        <LineChart
          data={data}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix=" pts"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#FF6B6B',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    );
  };

  const renderComparisonMetric = (metric: string, before: number, after: number) => {
    const change = after - before;
    const isImproved = change > 0;

    return (
      <View style={styles.metricRow}>
        <Text style={styles.metricName}>{metric}</Text>
        <View style={styles.metricValues}>
          <Text style={styles.metricBefore}>{before}</Text>
          <Icon 
            name="arrow-forward" 
            size={16} 
            color="#95a5a6" 
            style={{ marginHorizontal: 10 }}
          />
          <Text style={styles.metricAfter}>{after}</Text>
          <View style={[
            styles.changeIndicator,
            { backgroundColor: isImproved ? '#27ae60' : '#e74c3c' }
          ]}>
            <Icon 
              name={isImproved ? 'trending-up' : 'trending-down'} 
              size={12} 
              color="#fff" 
            />
            <Text style={styles.changeText}>
              {isImproved ? '+' : ''}{change}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          {/* Photo Selectors */}
          <View style={styles.photoSelectors}>
            <TouchableOpacity 
              style={styles.photoSelector}
              onPress={() => handlePhotoSelect(0)}
            >
              {selectedPhotos[0] ? (
                <>
                  <Image 
                    source={{ uri: selectedPhotos[0].uri }} 
                    style={styles.selectedPhoto}
                  />
                  <Text style={styles.photoDate}>
                    {format(new Date(selectedPhotos[0].takenAt), 'MMM dd')}
                  </Text>
                </>
              ) : (
                <>
                  <Icon name="add-a-photo" size={40} color="#95a5a6" />
                  <Text style={styles.selectPhotoText}>Select Photo</Text>
                </>
              )}
            </TouchableOpacity>
            
            <View style={styles.vsContainer}>
              <Text style={styles.vs}>VS</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.photoSelector}
              onPress={() => handlePhotoSelect(1)}
            >
              {selectedPhotos[1] ? (
                <>
                  <Image 
                    source={{ uri: selectedPhotos[1].uri }} 
                    style={styles.selectedPhoto}
                  />
                  <Text style={styles.photoDate}>
                    {format(new Date(selectedPhotos[1].takenAt), 'MMM dd')}
                  </Text>
                </>
              ) : (
                <>
                  <Icon name="add-a-photo" size={40} color="#95a5a6" />
                  <Text style={styles.selectPhotoText}>Select Photo</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Loading State */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B6B" />
              <Text style={styles.loadingText}>Analyzing comparison...</Text>
            </View>
          )}

          {/* Comparison Results */}
          {comparisonData && !isLoading && (
            <>
              {/* Chart */}
              {renderChart()}

              {/* Metrics Comparison */}
              <View style={styles.metricsSection}>
                <Text style={styles.sectionTitle}>Detailed Comparison</Text>
                {renderComparisonMetric('Overall Score', 72, 78)}
                {renderComparisonMetric('Hydration', 68, 71)}
                {renderComparisonMetric('Elasticity', 80, 82)}
                {renderComparisonMetric('Pore Condition', 65, 65)}
                {renderComparisonMetric('Skin Texture', 72, 75)}
                {renderComparisonMetric('Radiance', 75, 78)}
              </View>

              {/* Summary */}
              <View style={styles.summarySection}>
                <Icon name="lightbulb-outline" size={24} color="#f39c12" />
                <Text style={styles.summaryText}>{comparisonData.summary}</Text>
              </View>

              {/* Quick Actions */}
              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="share" size={20} color="#FF6B6B" />
                  <Text style={styles.actionText}>Share Comparison</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="save-alt" size={20} color="#FF6B6B" />
                  <Text style={styles.actionText}>Save Report</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Empty State */}
          {(!selectedPhotos[0] || !selectedPhotos[1]) && !isLoading && (
            <View style={styles.emptyState}>
              <Icon name="compare" size={60} color="#ddd" />
              <Text style={styles.emptyText}>Please select two photos to compare</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {renderPhotoSelector()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  photoSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoSelector: {
    backgroundColor: '#fff',
    width: '40%',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoDate: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 12,
  },
  selectPhotoText: {
    marginTop: 10,
    fontSize: 14,
    color: '#95a5a6',
  },
  vsContainer: {
    flex: 0.2,
    alignItems: 'center',
  },
  vs: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#95a5a6',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  metricsSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  metricName: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  metricValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricBefore: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  metricAfter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  summarySection: {
    backgroundColor: '#FFF9E6',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  actionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#95a5a6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  gridPhoto: {
    flex: 1/3,
    aspectRatio: 1,
    margin: 2,
  },
  gridPhotoImage: {
    width: '100%',
    height: '100%',
  },
  gridPhotoDate: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 10,
  },
});