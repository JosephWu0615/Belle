import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const MedicalBeautyRecordFlow = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Record Treatment</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Treatment Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. IPL Photofacial"
            placeholderTextColor="#95a5a6"
          />
          
          <Text style={styles.label}>Treatment Date</Text>
          <TouchableOpacity style={styles.input}>
            <Text style={styles.placeholderText}>Select Date</Text>
          </TouchableOpacity>
          
          <Text style={styles.label}>Clinic & Doctor</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter clinic and doctor name"
            placeholderTextColor="#95a5a6"
          />
          
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="$0"
            placeholderTextColor="#95a5a6"
            keyboardType="numeric"
          />
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // TODO: Implement save logic
            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>Save Record</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 48,
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#95a5a6',
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});