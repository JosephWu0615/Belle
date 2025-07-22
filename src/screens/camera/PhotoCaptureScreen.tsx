import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { PhotoStorage } from '../../utils/PhotoStorage';
import { usePhotoStore } from '../../store/photoStore';
import { useAchievementStore } from '../../store/achievementStore';
import { format } from 'date-fns';

// Mock voice guidance messages
const voiceMessages = {
  positioning: 'Please align your face within the frame',
  lowLight: 'Low light, please move to a brighter area',
  goodLight: 'Perfect lighting detected',
  capturing: 'Hold still, capturing',
  success: 'Photo captured!',
};

export const PhotoCaptureScreen = () => {
  const navigation = useNavigation();
  const { addPhoto, photos } = usePhotoStore();
  const { checkPhotoCount } = useAchievementStore();
  const [lightQuality, setLightQuality] = useState<'poor' | 'good' | 'excellent'>('good');
  const [isCapturing, setIsCapturing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState(voiceMessages.positioning);

  // Simulate face detection
  useEffect(() => {
    const timer = setTimeout(() => {
      setFaceDetected(true);
      setVoiceMessage(voiceMessages.goodLight);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Simulate light detection
  useEffect(() => {
    const timer = setInterval(() => {
      const qualities: ('poor' | 'good' | 'excellent')[] = ['poor', 'good', 'excellent'];
      const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
      setLightQuality(randomQuality);
      
      if (randomQuality === 'poor') {
        setVoiceMessage(voiceMessages.lowLight);
      } else if (faceDetected) {
        setVoiceMessage(voiceMessages.goodLight);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [faceDetected]);

  const handleCapture = async () => {
    setIsCapturing(true);
    setVoiceMessage(voiceMessages.capturing);

    try {
      // Initialize PhotoStorage if needed
      await PhotoStorage.init();
      
      // Generate a unique photo with current timestamp
      const captureTime = new Date();
      const timeStr = format(captureTime, 'HH:mm:ss');
      const dateStr = format(captureTime, 'yyyy-MM-dd');
      
      // Create a more realistic mock photo with varied colors based on light quality
      const photoColors = {
        excellent: '4CAF50',
        good: 'FFC107',
        poor: 'F44336'
      };
      const photoColor = photoColors[lightQuality];
      const qualityScore = lightQuality === 'excellent' ? 90 : lightQuality === 'good' ? 75 : 60;
      
      const mockPhotoUri = `https://via.placeholder.com/400x400/${photoColor}/FFFFFF?text=${dateStr}%20${timeStr}%20Score:${qualityScore}`;
      
      // Mock user ID (in real app, get from auth context)
      const userId = 'user123';
      
      // Simulate capture delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a realistic mock photo object
      const mockPhoto = {
        id: `photo-${Date.now()}`,
        uri: mockPhotoUri,
        takenAt: captureTime,
        lightQuality,
        faceDetected,
        paths: {
          original: mockPhotoUri,
          compressed: mockPhotoUri,
          thumbnail: mockPhotoUri,
        },
        metadata: {
          fileSize: 1024 * 1024 * (1 + Math.random() * 2), // 1-3MB random size
          dimensions: { width: 400, height: 400 },
          format: 'jpeg' as const,
          compressionRatio: 0.85,
        },
        analysisId: `analysis-${Date.now()}`, // Add analysis ID for navigation
      };
      
      // Add photo to store
      await addPhoto(mockPhoto);
      
      // Check achievements
      const photoCount = photos.size + 1;
      await checkPhotoCount(userId, photoCount);
      
      setVoiceMessage(voiceMessages.success);
      
      Alert.alert(
        'Photo Captured',
        'Photo saved, performing AI analysis',
        [
          {
            text: 'View Analysis',
            onPress: () => {
              navigation.goBack(); // Close the modal first
              setTimeout(() => {
                // Navigate to AI Insights tab after modal closes
                navigation.navigate('Main', { screen: 'AIInsights' } as never);
              }, 100);
            },
          },
          {
            text: 'Continue Shooting',
            onPress: () => {
              setFaceDetected(false);
              setVoiceMessage(voiceMessages.positioning);
            },
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Failed to capture photo:', error);
      Alert.alert('Capture Failed', 'Please try again');
    } finally {
      setIsCapturing(false);
    }
  };

  const getLightIndicatorColor = () => {
    switch (lightQuality) {
      case 'excellent':
        return '#4CAF50';
      case 'good':
        return '#FFC107';
      case 'poor':
        return '#F44336';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Camera Assistant</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.cameraContainer}>
        {/* Camera preview placeholder */}
        <View style={styles.cameraPreview}>
          {/* Face outline guide */}
          <View style={styles.faceGuide}>
            <View style={styles.faceOutline}>
              <Icon 
                name="face" 
                size={120} 
                color={faceDetected ? '#4CAF50' : '#fff'} 
                style={{ opacity: 0.7 }}
              />
            </View>
          </View>

          {/* Light indicator */}
          <View style={styles.lightIndicator}>
            <Icon name="wb-sunny" size={24} color={getLightIndicatorColor()} />
            <Text style={[styles.lightText, { color: getLightIndicatorColor() }]}>
              {lightQuality === 'excellent' ? 'Perfect Light' : 
               lightQuality === 'good' ? 'Good Light' : 'Low Light'}
            </Text>
          </View>

          {/* Voice guidance */}
          <View style={styles.voiceGuidance}>
            <Icon name="mic" size={20} color="#fff" />
            <Text style={styles.voiceText}>{voiceMessage}</Text>
          </View>
        </View>

        {/* Professional tools */}
        <View style={styles.toolsBar}>
          <TouchableOpacity style={styles.tool}>
            <Icon name="wb-incandescent" size={24} color="#fff" />
            <Text style={styles.toolText}>Fill Light</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tool}>
            <Icon name="hdr-strong" size={24} color="#fff" />
            <Text style={styles.toolText}>HDR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tool}>
            <Icon name="grid-on" size={24} color="#fff" />
            <Text style={styles.toolText}>Grid</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Capture button */}
      <View style={styles.captureContainer}>
        <TouchableOpacity
          style={[
            styles.captureButton,
            (lightQuality === 'excellent' && faceDetected) && styles.captureButtonReady,
          ]}
          onPress={handleCapture}
          disabled={isCapturing}
        >
          {isCapturing ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <View style={styles.captureInner} />
          )}
        </TouchableOpacity>
        
        {/* Auto-capture indicator */}
        {lightQuality === 'excellent' && faceDetected && !isCapturing && (
          <Text style={styles.autoCaptureTip}>Ready for auto-capture...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cameraContainer: {
    flex: 1,
  },
  cameraPreview: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceOutline: {
    width: 250,
    height: 300,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 125,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightIndicator: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  lightText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  voiceGuidance: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  voiceText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  toolsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  tool: {
    alignItems: 'center',
  },
  toolText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  captureContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonReady: {
    backgroundColor: '#4CAF50',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  autoCaptureTip: {
    color: '#4CAF50',
    marginTop: 10,
    fontSize: 14,
  },
  closeButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});