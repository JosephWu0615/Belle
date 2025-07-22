import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const AICameraGuideScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>AI Camera Assistant</Text>
        <View style={styles.cameraPreview}>
          <View style={styles.faceOutline}>
            <Text style={styles.faceIcon}>👤</Text>
          </View>
          <Text style={styles.tip}>For the most accurate comparison, we recommend taking photos in the same position and lighting each time</Text>
        </View>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={() => navigation.navigate('AddCoreProducts' as never)}
        >
          <Text style={styles.captureButtonText}>Capture</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  cameraPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceOutline: {
    width: 200,
    height: 250,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  faceIcon: {
    fontSize: 100,
  },
  tip: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  captureButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});