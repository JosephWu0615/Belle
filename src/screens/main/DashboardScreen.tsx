import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FloatingActionButton } from '../../components/global/FloatingActionButton';
import { useRecordStore } from '../../store/recordStore';
import { usePhotoStore } from '../../store/photoStore';
import { format } from 'date-fns';
import { Photo } from '../../types';

export const DashboardScreen = () => {
  const navigation = useNavigation();
  const { records, getRecordsByDate } = useRecordStore();
  const { photos, getPhotosByDate, loadPhotos } = usePhotoStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, []);

  const fabOptions = [
    {
      icon: 'face',
      label: 'Record Skin',
      onPress: () => navigation.navigate('DailySkinRecord' as never),
    },
    {
      icon: 'local-hospital',
      label: 'Record Treatment',
      onPress: () => navigation.navigate('MedicalBeautyRecord' as never),
    },
    {
      icon: 'shopping-bag',
      label: 'Record Product',
      onPress: () => navigation.navigate('ProductRecord' as never),
    },
  ];

  const getMarkedDates = () => {
    const marked: any = {};
    
    // Add record dots
    records.forEach(record => {
      const dateStr = format(new Date(record.date), 'yyyy-MM-dd');
      if (!marked[dateStr]) {
        marked[dateStr] = { dots: [] };
      }
      
      const color = record.type === 'daily' ? '#4169E1' : 
                    record.type === 'medical' ? '#DC143C' : '#FFD700';
      
      marked[dateStr].dots.push({ color });
    });
    
    // Add photo indicators
    Array.from(photos.values()).forEach(photo => {
      const dateStr = format(new Date(photo.takenAt), 'yyyy-MM-dd');
      if (!marked[dateStr]) {
        marked[dateStr] = { dots: [] };
      }
      
      // Add camera icon for photos
      marked[dateStr].dots.push({ color: '#4CAF50' });
    });
    
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    marked[todayStr] = {
      ...marked[todayStr],
      selected: true,
      selectedColor: '#FF6B6B',
    };
    
    return marked;
  };

  const renderSelectedDateRecords = () => {
    const dateRecords = getRecordsByDate(selectedDate);
    const datePhotos = getPhotosByDate(selectedDate);
    
    if (dateRecords.length === 0 && datePhotos.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No records for this day</Text>
        </View>
      );
    }
    
    return (
      <ScrollView style={styles.recordsList}>
        {/* Display photos */}
        {datePhotos.length > 0 && (
          <View style={styles.photosSection}>
            <View style={styles.photoHeader}>
              <Icon name="camera-alt" size={20} color="#4CAF50" />
              <Text style={styles.photoTitle}>Today's Photos</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {datePhotos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  onPress={() => {
                    setSelectedPhoto(photo);
                    setShowPhotoModal(true);
                  }}
                >
                  <View style={styles.photoContainer}>
                    <Image
                      source={{ uri: photo.paths?.thumbnail || photo.uri }}
                      style={styles.photoThumbnail}
                    />
                    <View style={[
                      styles.lightQualityBadge,
                      { backgroundColor: 
                        photo.lightQuality === 'excellent' ? '#4CAF50' :
                        photo.lightQuality === 'good' ? '#FFC107' : '#F44336'
                      }
                    ]}>
                      <Icon name="wb-sunny" size={12} color="#fff" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        {/* Display records */}
        {dateRecords.map((record, index) => (
          <View key={index} style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <Text style={styles.recordType}>
                {record.type === 'daily' ? 'Skin Record' :
                 record.type === 'medical' ? 'Treatment Record' : 'Product Record'}
              </Text>
              <Text style={styles.recordTime}>
                {format(new Date(record.date), 'HH:mm')}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>AI Learning Progress</Text>
          <Text style={styles.subText}>
            Keep recording to help AI understand your skin better
          </Text>
        </View>
        
        <Calendar
          markedDates={getMarkedDates()}
          markingType={'multi-dot'}
          onDayPress={(day: any) => setSelectedDate(new Date(day.dateString))}
          theme={{
            selectedDayBackgroundColor: '#FF6B6B',
            todayTextColor: '#FF6B6B',
            arrowColor: '#FF6B6B',
          }}
        />
        
        <View style={styles.recordsSection}>
          <Text style={styles.sectionTitle}>
            Records for {format(selectedDate, 'MMM dd')}
          </Text>
          {renderSelectedDateRecords()}
        </View>
      </ScrollView>
      
      <FloatingActionButton options={fabOptions} />
      
      {/* Photo Modal */}
      <Modal
        visible={showPhotoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPhotoModal(false)}
        >
          <View style={styles.modalContent}>
            {selectedPhoto && (
              <>
                <Image
                  source={{ uri: selectedPhoto.paths?.compressed || selectedPhoto.uri }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
                <View style={styles.modalInfo}>
                  <View style={styles.modalInfoRow}>
                    <Icon name="wb-sunny" size={20} color={
                      selectedPhoto.lightQuality === 'excellent' ? '#4CAF50' :
                      selectedPhoto.lightQuality === 'good' ? '#FFC107' : '#F44336'
                    } />
                    <Text style={styles.modalInfoText}>
                      Light Quality: {
                        selectedPhoto.lightQuality === 'excellent' ? 'Perfect' :
                        selectedPhoto.lightQuality === 'good' ? 'Good' : 'Poor'
                      }
                    </Text>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <Icon name="access-time" size={20} color="#666" />
                    <Text style={styles.modalInfoText}>
                      {format(new Date(selectedPhoto.takenAt), 'HH:mm')}
                    </Text>
                  </View>
                  {selectedPhoto.analysisId && (
                    <TouchableOpacity 
                      style={styles.viewAnalysisButton}
                      onPress={() => {
                        setShowPhotoModal(false);
                        navigation.navigate('AIInsights' as never);
                      }}
                    >
                      <Text style={styles.viewAnalysisText}>View AI Analysis</Text>
                      <Icon name="chevron-right" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  recordsSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
    minHeight: 200,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  recordsList: {
    maxHeight: 300,
  },
  recordCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  recordTime: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#95a5a6',
  },
  photosSection: {
    marginBottom: 20,
  },
  photoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  photoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 8,
  },
  photoContainer: {
    marginRight: 10,
    position: 'relative',
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  lightQualityBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#f0f0f0',
  },
  modalInfo: {
    padding: 20,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalInfoText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 10,
  },
  viewAnalysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF5F5',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  viewAnalysisText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
});