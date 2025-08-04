import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Switch,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { PhotoStorage } from '../../utils/PhotoStorage';
import { usePhotoStore } from '../../store/photoStore';
import { useAchievementStore } from '../../store/achievementStore';
import { format } from 'date-fns';
import { theme } from '../../theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
  const [, setVoiceMessage] = useState(voiceMessages.positioning);
  const [vocalGuidance, setVocalGuidance] = useState(true);
  const [volumeLevel] = useState(60);

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
      
      if (vocalGuidance) {
        if (randomQuality === 'poor') {
          setVoiceMessage(voiceMessages.lowLight);
        } else if (faceDetected) {
          setVoiceMessage(voiceMessages.goodLight);
        }
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [faceDetected, vocalGuidance]);

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


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={28} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Skin Scan</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Icon name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Vocal Guidance Toggle */}
      <View style={styles.vocalGuidanceSection}>
        <Text style={styles.vocalGuidanceLabel}>Vocal Guidance</Text>
        <View style={styles.vocalGuidanceToggle}>
          <Icon name="volume-up" size={20} color={theme.colors.text.secondary} style={styles.volumeIcon} />
          <Text style={styles.volumeText}>{volumeLevel}%</Text>
          <Text style={styles.volumeNote}>Rear camera only</Text>
          <Switch
            value={vocalGuidance}
            onValueChange={setVocalGuidance}
            trackColor={{ false: theme.colors.border.light, true: theme.colors.primary.blue }}
            thumbColor={vocalGuidance ? theme.colors.text.inverse : theme.colors.background.tertiary}
            style={styles.switch}
          />
        </View>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraPreview}>
          {/* Face Guide Overlay */}
          <View style={styles.faceGuideOverlay}>
            <View style={styles.faceGuideBox}>
              {/* Face outline visual guide */}
              <View style={styles.faceOutline} />
            </View>
          </View>
        </View>
      </View>

      {/* Instructions and Capture Button */}
      <View style={styles.bottomSection}>
        <Text style={styles.instructionText}>
          Follow voice guidance to find the right distance.
          Close your eyes when prompted.
          The camera will take your photo automatically.
        </Text>
        
        <TouchableOpacity
          style={[
            styles.captureButton,
            isCapturing && styles.captureButtonActive,
          ]}
          onPress={handleCapture}
          disabled={isCapturing}
        >
          {isCapturing ? (
            <ActivityIndicator size="large" color={theme.colors.text.inverse} />
          ) : (
            <View style={styles.captureInner} />
          )}
        </TouchableOpacity>
      </View>
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
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.background.tertiary,
  },
  vocalGuidanceSection: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  vocalGuidanceLabel: {
    ...theme.typography.styles.headline,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  vocalGuidanceToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeIcon: {
    marginRight: theme.spacing.sm,
  },
  volumeText: {
    ...theme.typography.styles.callout,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.md,
  },
  volumeNote: {
    ...theme.typography.styles.caption1,
    color: theme.colors.text.tertiary,
    flex: 1,
  },
  switch: {
    marginLeft: 'auto',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: theme.colors.text.primary,
    borderRadius: theme.borderRadius.card,
    margin: theme.layout.screenPadding,
    overflow: 'hidden',
  },
  cameraPreview: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  faceGuideOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuideBox: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceOutline: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: theme.colors.skin.score,
    borderRadius: screenWidth * 0.35,
    borderStyle: 'dashed',
  },
  bottomSection: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing['4xl'],
  },
  instructionText: {
    ...theme.typography.styles.footnote,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing['3xl'],
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.skin.score,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  captureButtonActive: {
    opacity: 0.7,
  },
  captureInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.text.inverse,
  },
});