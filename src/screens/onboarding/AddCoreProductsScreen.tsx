import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const AddCoreProductsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tell us what you're using?</Text>
        
        <TouchableOpacity style={styles.scanButton}>
          <Icon name="qr-code-scanner" size={48} color="#FF6B6B" />
          <Text style={styles.scanButtonText}>Scan Product Barcode</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.manualButton}>
          <Text style={styles.manualButtonText}>Search or Add Manually</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('SetPrimaryGoal' as never)}
        >
          <Text style={styles.skipButtonText}>Add Later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 50,
  },
  scanButton: {
    backgroundColor: '#FFE5E5',
    width: 200,
    height: 200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  scanButtonText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginTop: 10,
  },
  manualButton: {
    marginBottom: 20,
  },
  manualButtonText: {
    fontSize: 16,
    color: '#FF6B6B',
    textDecorationLine: 'underline',
  },
  skipButton: {
    position: 'absolute',
    bottom: 40,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#95a5a6',
  },
});